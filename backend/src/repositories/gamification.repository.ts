import { query, queryOne } from "../lib/db";
import type { AchievementRow, StudentAchievementRow } from "../types/db";

export async function listAllAchievements(): Promise<AchievementRow[]> {
  return query<AchievementRow>('SELECT * FROM "Achievement" ORDER BY label ASC');
}

export async function listStudentAchievements(studentId: string): Promise<Array<AchievementRow & { earnedAt: Date }>> {
  return query(
    `SELECT a.*, sa."earnedAt" FROM "Achievement" a
     JOIN "StudentAchievement" sa ON sa."achievementId" = a.id
     WHERE sa."studentId" = $1
     ORDER BY sa."earnedAt" DESC`,
    [studentId],
  );
}

export async function awardAchievement(studentId: string, achievementKey: string): Promise<StudentAchievementRow | null> {
  const achievement = await queryOne<AchievementRow>('SELECT * FROM "Achievement" WHERE key = $1', [achievementKey]);
  if (!achievement) return null;

  return queryOne<StudentAchievementRow>(
    `INSERT INTO "StudentAchievement" ("studentId", "achievementId") VALUES ($1, $2)
     ON CONFLICT ("studentId", "achievementId") DO NOTHING
     RETURNING *`,
    [studentId, achievement.id],
  );
}

export async function addXP(studentId: string, amount: number): Promise<number> {
  const row = await queryOne<{ xp: number }>(
    `UPDATE "StudentProfile" SET xp = xp + $2 WHERE "userId" = $1 RETURNING xp`,
    [studentId, amount],
  );
  return row?.xp ?? 0;
}

/**
 * Updates the daily streak: increments if the student last studied yesterday,
 * resets to 1 if they missed a day, leaves unchanged if already studied today.
 */
export async function touchStreak(studentId: string): Promise<number> {
  const profile = await queryOne<{ lastStudyDate: Date | null; streakCount: number }>(
    `SELECT "lastStudyDate", "streakCount" FROM "StudentProfile" WHERE "userId" = $1`,
    [studentId],
  );
  if (!profile) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (profile.lastStudyDate) {
    const last = new Date(profile.lastStudyDate);
    last.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today.getTime() - last.getTime()) / 86_400_000);

    if (diffDays === 0) {
      return profile.streakCount; // already studied today
    }
    if (diffDays === 1) {
      const row = await queryOne<{ streakCount: number }>(
        `UPDATE "StudentProfile" SET "streakCount" = "streakCount" + 1, "lastStudyDate" = now() WHERE "userId" = $1 RETURNING "streakCount"`,
        [studentId],
      );
      return row?.streakCount ?? 0;
    }
  }

  const row = await queryOne<{ streakCount: number }>(
    `UPDATE "StudentProfile" SET "streakCount" = 1, "lastStudyDate" = now() WHERE "userId" = $1 RETURNING "streakCount"`,
    [studentId],
  );
  return row?.streakCount ?? 1;
}
