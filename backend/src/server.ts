import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { pool } from "./lib/db";

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`StudyPilot AI backend listening on port ${env.PORT} (${env.NODE_ENV})`);
});

async function shutdown(signal: string) {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  server.close(async () => {
    await pool.end();
    logger.info("Shutdown complete");
    process.exit(0);
  });

  // Force-exit if graceful shutdown hangs
  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10_000);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", { reason });
});
