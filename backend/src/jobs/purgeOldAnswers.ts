/**
 * StudyPilot AI — data retention job.
 * Per the GDPR-aligned spec requirement: "No storage of student answers
 * longer than 30 days unless user opts in." Run on a schedule (cron /
 * Cloud Scheduler / similar) in production via: npm run job:purge-old-answers
 */
import { purgeOldHomeworkSessions } from "../repositories/homework.repository";
import { env } from "../config/env";
import { logger } from "../lib/logger";
import { pool } from "../lib/db";

async function run() {
  logger.info(`Running answer-retention purge (retention: ${env.ANSWER_RETENTION_DAYS} days)...`);
  const deletedCount = await purgeOldHomeworkSessions(env.ANSWER_RETENTION_DAYS);
  logger.info(`Purge complete: removed ${deletedCount} homework session(s) past retention (excluding opted-in users).`);
}

run()
  .catch((err) => {
    logger.error("Retention purge job failed", { error: err instanceof Error ? err.message : String(err) });
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
