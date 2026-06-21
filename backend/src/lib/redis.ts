import Redis from "ioredis";
import { env } from "../config/env";
import { logger } from "./logger";

// Redis is OPTIONAL — all AI features work without it; caching and
// persistent rate-limiting are simply disabled when Redis is unavailable.
let _redis: Redis | null = null;
let _redisAvailable = false;

try {
  _redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    enableOfflineQueue: false,
    connectTimeout: 3000,
  });

  _redis.on("error", (err) => {
    if (_redisAvailable) {
      logger.warn("Redis disconnected — caching disabled", { error: err.message });
    }
    _redisAvailable = false;
  });

  _redis.on("connect", () => {
    _redisAvailable = true;
    logger.info("Redis connected — caching enabled");
  });

  _redis.connect().catch(() => {
    logger.warn("Redis not available — running without cache (all AI features still work)");
  });
} catch {
  logger.warn("Redis not configured — running without cache (all AI features still work)");
}

// Null-safe wrappers — callers should use these instead of `redis` directly
export const redisGet = async (key: string): Promise<string | null> => {
  if (!_redis || !_redisAvailable) return null;
  return _redis.get(key).catch(() => null);
};

export const redisSet = async (key: string, value: string, ttlSeconds?: number): Promise<void> => {
  if (!_redis || !_redisAvailable) return;
  const cmd = ttlSeconds
    ? _redis.set(key, value, "EX", ttlSeconds)
    : _redis.set(key, value);
  await cmd.catch((err) =>
    logger.warn("Failed to write Redis cache", { error: (err as Error).message }),
  );
};

export const checkRedisConnection = async (): Promise<boolean> => {
  return _redisAvailable;
};

// Legacy export for any direct usage (now null-safe)
export const redis = {
  get: redisGet,
  set: (key: string, value: string, ...args: unknown[]) => {
    // Support .set(key, value, "EX", ttl) signature
    const exIdx = args.indexOf("EX");
    const ttl = exIdx !== -1 ? (args[exIdx + 1] as number) : undefined;
    return redisSet(key, value, ttl);
  },
  ping: async () => (_redisAvailable ? "PONG" : "UNAVAILABLE"),
} as const;
