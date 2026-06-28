import { createHash } from 'crypto';
import { getRedis } from '@/lib/redis';
import * as populates from './populates';

// The cache namespace is AUTO-DERIVED from the shape of what we fetch from
// Strapi. Every exported populate builder describes a query's response shape, so
// hashing their combined output gives a namespace that changes by itself the
// moment we change what we ask Strapi for. Old, wrong-shaped entries are then
// abandoned automatically (and expire via TTL) — no one has to remember to bump
// a version when editing a populate. CACHE_VERSION still works as an explicit
// override / emergency full flush.
//
// Caveat: this captures the populate BUILDERS. The few getters in data.ts that
// inline a one-off `populate`/`fields` are not covered; if you change one of
// those, either lift it into a builder here or set CACHE_VERSION once. The short
// TTL also self-heals such a change within the hour.
function shapeVersion(): string {
  try {
    const shapes = Object.keys(populates)
      .sort()
      .map((name) => {
        const value = (populates as Record<string, unknown>)[name];
        return [name, typeof value === 'function' ? (value as () => unknown)() : value];
      });
    return 'auto-' + createHash('sha1').update(JSON.stringify(shapes)).digest('hex').slice(0, 10);
  } catch {
    // A hashing problem must never break caching — fall back to a static namespace.
    return 'static';
  }
}

const VERSION = process.env.CACHE_VERSION || shapeVersion();
const PREFIX = `msc:${VERSION}:`;
// One hour. This is ONLY the backstop for the rare case where a purge webhook
// never lands — correctness is owned by the invalidation webhook (which now
// retries). Kept short so that even a fully-missed purge self-heals within an
// hour instead of lingering for days; at this traffic the extra re-fetches are
// negligible.
const DEFAULT_TTL = parseInt(process.env.CACHE_TTL_SECONDS || '3600', 10);

const dataKey = (key: string) => `${PREFIX}${key}`;
const tagKey = (tag: string) => `${PREFIX}tag:${tag}`;
// A single monotonic counter bumped on every purge. It lets a read detect that
// a purge landed while its upstream fetch was in flight, and refuse to write a
// now-stale result. See the race note on `cached` below.
const genKey = `${PREFIX}gen`;

// Atomic conditional write: persist the entry and index it under its tags ONLY
// IF the purge generation has not advanced since the read captured it. Run as a
// Lua script because the shared ioredis connection is multiplexed across
// concurrent requests, so WATCH/MULTI optimistic locking is not safe here.
//   KEYS[1] = data key, KEYS[2] = generation key
//   ARGV[1] = expected generation, ARGV[2] = value
//   ARGV[3] = entry TTL, ARGV[4] = tag-index TTL, ARGV[5..] = tag keys
const WRITE_IF_GEN_UNCHANGED = `
local cur = redis.call('GET', KEYS[2])
if cur == false then cur = '' end
if cur ~= ARGV[1] then return 0 end
redis.call('SET', KEYS[1], ARGV[2], 'EX', ARGV[3])
for i = 5, #ARGV do
  redis.call('SADD', ARGV[i], KEYS[1])
  redis.call('EXPIRE', ARGV[i], ARGV[4], 'GT')
end
return 1
`;

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
 *
 * Race safety: a read that misses captures the purge generation *before*
 * fetching, then writes through a generation-gated script. If a purge lands
 * while `fn` is in flight (the generation advances), the write is rejected and
 * the entry is left absent for the next request to refill. This closes the
 * read-through race where a slow read would otherwise re-populate a
 * just-purged key with pre-edit data and pin it until TTL ({@link revalidateTags}
 * bumps the generation before deleting, so the two orderings are mutually
 * exclusive).
 */
export async function cached<T>(
  key: string,
  tags: string[],
  fn: () => Promise<T>,
  options: CacheOptions<T> = {},
): Promise<T> {
  const redis = getRedis();

  let generation = '';
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
    // Miss: snapshot the generation so the write below can detect a concurrent
    // purge. A read error here just means we may skip caching this once (safe).
    try {
      generation = (await redis.get(genKey)) ?? '';
    } catch (err) {
      console.error(`[cache] generation read failed for ${key}:`, (err as Error).message);
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
    // The tag index lives a little longer than its entries so a purge after the
    // entries expire still finds and cleans up the set. `GT` (Redis 7+) only
    // ever extends a TTL, so a concurrent write for another key under the same
    // tag can never shorten it below a live entry's lifetime.
    try {
      await redis.eval(
        WRITE_IF_GEN_UNCHANGED,
        2,
        fullKey,
        genKey,
        generation,
        JSON.stringify(value),
        String(ttl),
        String(ttl + 300),
        ...tags.map(tagKey),
      );
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

  // Bump the generation BEFORE deleting anything. A read that already wrote its
  // entry (it saw the old generation) will have that entry removed by the
  // deletes below; a read still in flight (also saw the old generation) will
  // find the generation advanced and refuse to write. Either ordering leaves no
  // stale entry behind. See the race note on `cached`.
  try {
    await redis.incr(genKey);
  } catch (err) {
    console.error('[cache] generation bump failed:', (err as Error).message);
  }

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
