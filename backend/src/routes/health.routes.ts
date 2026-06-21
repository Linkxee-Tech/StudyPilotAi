import { Router } from "express";
import { checkDatabaseConnection } from "../lib/db";
import { checkRedisConnection } from "../lib/redis";

const router = Router();

router.get("/", async (_req, res) => {
  const [dbOk, redisOk] = await Promise.all([checkDatabaseConnection(), checkRedisConnection()]);
  const healthy = dbOk && redisOk;
  res.status(healthy ? 200 : 503).json({
    success: healthy,
    data: { status: healthy ? "ok" : "degraded", database: dbOk, redis: redisOk, timestamp: new Date().toISOString() },
  });
});

export default router;
