import { query, queryOne } from "../lib/db";
import type { HomeworkSessionRow } from "../types/db";

export async function createHomeworkSession(
  studentId: string,
  questionText: string,
  subjectId?: string | null,
  imageUrl?: string | null,
): Promise<HomeworkSessionRow> {
  const row = await queryOne<HomeworkSessionRow>(
    `INSERT INTO "HomeworkSession" ("studentId", "questionText", "subjectId", "imageUrl")
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [studentId, questionText, subjectId ?? null, imageUrl ?? null],
  );
  if (!row) throw new Error("Failed to create homework session");
  return row;
}

export async function findHomeworkSession(id: string): Promise<HomeworkSessionRow | null> {
  return queryOne<HomeworkSessionRow>('SELECT * FROM "HomeworkSession" WHERE id = $1', [id]);
}

export async function incrementHintsGiven(id: string): Promise<HomeworkSessionRow | null> {
  return queryOne<HomeworkSessionRow>(
    `UPDATE "HomeworkSession" SET "hintsGiven" = "hintsGiven" + 1 WHERE id = $1 RETURNING *`,
    [id],
  );
}

export async function markHomeworkResolved(id: string): Promise<void> {
  await query(`UPDATE "HomeworkSession" SET resolved = true WHERE id = $1`, [id]);
}

/** Per spec: purge homework sessions older than retentionDays unless the owning user opted in to retain them. */
export async function purgeOldHomeworkSessions(retentionDays: number): Promise<number> {
  const rows = await query<{ id: string }>(
    `DELETE FROM "HomeworkSession" hs
     USING "StudentProfile" sp, "User" u
     WHERE hs."studentId" = sp."userId"
       AND sp."userId" = u.id
       AND u."retainAnswers" = false
       AND hs."createdAt" < now() - ($1 || ' days')::interval
     RETURNING hs.id`,
    [retentionDays],
  );
  return rows.length;
}
