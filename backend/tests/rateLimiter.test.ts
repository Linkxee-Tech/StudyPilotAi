import { describe, it, expect, beforeAll } from "vitest";
import express from "express";
import request from "supertest";
import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redis } from "../src/lib/redis";

/**
 * We build a tiny isolated Express app with a low-limit limiter (rather than
 * importing the real generalLimiter/aiPromptLimiter, whose limits are 300/day
 * and 100/day respectively — too high to exercise in a fast test). The
 * underlying mechanism (express-rate-limit + RedisStore + real Redis) is
 * identical to what middleware/rateLimiter.ts uses in production.
 */
function buildTestApp(limit: number) {
  const app = express();
  const prefix = `rl:test:${Date.now()}:`;
  app.use(
    rateLimit({
      windowMs: 60_000,
      limit,
      standardHeaders: true,
      legacyHeaders: false,
      store: new RedisStore({
        sendCommand: (...args: string[]) => (redis.call as (...a: string[]) => Promise<any>)(...args),
        prefix,
      }),
      keyGenerator: () => "fixed-test-key",
    }),
  );
  app.get("/ping", (_req, res) => res.json({ ok: true }));
  return app;
}

describe("rate limiting (real Redis)", () => {
  beforeAll(async () => {
    const pong = await redis.ping();
    expect(pong).toBe("PONG");
  });

  it("allows requests under the limit and blocks once the limit is exceeded", async () => {
    const app = buildTestApp(3);

    const r1 = await request(app).get("/ping");
    const r2 = await request(app).get("/ping");
    const r3 = await request(app).get("/ping");
    const r4 = await request(app).get("/ping");

    expect(r1.status).toBe(200);
    expect(r2.status).toBe(200);
    expect(r3.status).toBe(200);
    expect(r4.status).toBe(429);
  });
});
