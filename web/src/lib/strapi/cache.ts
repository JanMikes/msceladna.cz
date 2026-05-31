import { getRedis } from '@/lib/redis';

// Bump CACHE_VERSION to invalidate every cached entry at once (e.g. when the
// shape of a cached Strapi response changes). We cache RAW Strapi responses and
// run mappers fresh on every request, so most deploys do NOT require a bump —
// only changes to what we ask Strapi to return do.
const VERSION = process.env.CACHE_VERSION || 'v1';
const PREFIX = `msc:${VERSION}:`;
// One week. The TTL is only a safety net — correctness is owned by the
// tag-based invalidation webhook (Strapi purges the moment content changes),
// so a long TTL is safe and simply means fewer cold misses against Strapi.
const DEFAULT_TTL = parseInt(process.env.CACHE_TTL_SECONDS || '604800', 10);

const dataKey = (key: string) => `${PREFIX}${key}`;
const tagKey = (tag: string) => `${PREFIX}tag:${tag}`;

interface CacheOptions<T> {
  ttl?: number;
  /**
   * Value to return (uncached) when `fn` throws. `fn` is expected to throw only
   * on a genuine upstream failure — a successful-but-empty response should be
   * returned normally, and it WILL be cached. That empty entry is purged by the
   * invalidation webhook as soon as matching content is created, so the next
   * request returns the populated result without re-querying Strapi.
   */
  fallback?: T;
}

/**
 * Read-through cache backed by Redis. On a hit the cached value is returned
 * without calling `fn`; on a miss `fn` runs and the result is stored under
 * `key` and indexed under every entry in `tags` so it can be purged later via
 * {@link revalidateTags}.
 *
 * Any successful result is cached, including empty ones. If `fn` throws (a real
 * upstream failure) nothing is cached and `fallback` is returned — so an outage
 * is never persisted as a "not found" / empty result.
 *
 * If Redis is unavailable this is fully transparent: `fn` runs every time.
 */
export async function cached<T>(
  key: string,
  tags: string[],
  fn: () => Promise<T>,
  options: CacheOptions<T> = {},
): Promise<T> {
  const redis = getRedis();

  if (redis) {
    const fullKey = dataKey(key);
    try {
      const hit = await redis.get(fullKey);
      if (hit !== null) {
        return JSON.parse(hit) as T;
      }
    } catch (err) {
      console.error(`[cache] get failed for ${key}:`, (err as Error).message);
    }
  }

  let value: T;
  try {
    value = await fn();
  } catch (err) {
    if ('fallback' in options) {
      console.error(`[cache] fetch failed for ${key}, serving fallback:`, (err as Error).message);
      return options.fallback as T;
    }
    throw err;
  }

  if (redis) {
    const fullKey = dataKey(key);
    const ttl = options.ttl ?? DEFAULT_TTL;
    try {
      const pipe = redis.multi();
      pipe.set(fullKey, JSON.stringify(value), 'EX', ttl);
      for (const tag of tags) {
        const tk = tagKey(tag);
        pipe.sadd(tk, fullKey);
        // Keep the tag index alive a little longer than its entries so a purge
        // after the entries expire still finds and cleans up the set. `GT` (Redis
        // 7+) only ever extends the TTL, so a concurrent write for another key
        // under the same tag can never shorten it below a live entry's lifetime.
        pipe.expire(tk, ttl + 300, 'GT');
      }
      await pipe.exec();
    } catch (err) {
      console.error(`[cache] set failed for ${key}:`, (err as Error).message);
    }
  }

  return value;
}

/**
 * Purges every cached entry indexed under any of the given tags. Returns the
 * tags that were processed. Safe to call when Redis is unavailable (no-op).
 */
export async function revalidateTags(tags: string[]): Promise<string[]> {
  const redis = getRedis();
  if (!redis) return [];

  const purged: string[] = [];
  for (const tag of tags) {
    const tk = tagKey(tag);
    try {
      const keys = await redis.smembers(tk);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      await redis.del(tk);
      purged.push(tag);
    } catch (err) {
      console.error(`[cache] revalidate failed for ${tag}:`, (err as Error).message);
    }
  }
  return purged;
}
