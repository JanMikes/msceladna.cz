import Redis from 'ioredis';
import { config } from '@/lib/config';

// Reuse a single connection across HMR reloads in dev and across requests in prod.
const globalForRedis = globalThis as unknown as { __msRedis?: Redis | null };

/**
 * Returns a shared Redis client, or `null` when Redis is not configured or
 * unreachable. Callers MUST treat `null` as "no cache available" and fall
 * back to a direct data source — the site must never break because Redis is
 * down.
 */
export function getRedis(): Redis | null {
  if (globalForRedis.__msRedis !== undefined) {
    return globalForRedis.__msRedis;
  }

  if (!config.redis.url) {
    globalForRedis.__msRedis = null;
    return null;
  }

  const client = new Redis(config.redis.url, {
    // Fail fast instead of queueing commands when Redis is unavailable, so a
    // Redis outage degrades to direct Strapi fetches rather than hanging.
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    connectTimeout: 2000,
    retryStrategy: (times) => Math.min(times * 200, 2000),
  });

  client.on('error', (err) => {
    console.error('[redis] connection error:', err.message);
  });

  globalForRedis.__msRedis = client;
  return client;
}
