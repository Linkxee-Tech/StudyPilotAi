import { query, queryOne, withTransaction } from "../lib/db";
import type { StudyPlanEntryRow, ExamCountdownRow, PlanItemType, ExamBoard } from "../types/db";

export interface CreatePlanEntryInput {
  studentId: string;
  date: Date;
  subjectId?: string | null;
  topicTitle: string;
  type: PlanItemType;
  durationMinutes: number;
}

export async function insertStudyPlanEntries(entries: CreatePlanEntryInput[]): Promise<StudyPlanEntryRow[]> {
  return withTransaction(async (client) => {
    const rows: StudyPlanEntryRow[] = [];
    for (const e of entries) {
      const result = await client.query<StudyPlanEntryRow>(
        `INSERT INTO "StudyPlanEntry" ("studentId", date, "subjectId", "topicTitle", type, "durationMinutes")
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [e.studentId, e.date, e.subjectId ?? null, e.topicTitle, e.type, e.durationMinutes],
      );
      rows.push(result.rows[0]);
    }
    return rows;
  });
}

export async function listStudyPlanEntries(studentId: string, fromDate: Date, toDate: Date): Promise<StudyPlanEntryRow[]> {
  return query<StudyPlanEntryRow>(
    `SELECT * FROM "StudyPlanEntry" WHERE "studentId" = $1 AND date >= $2 AND date <= $3 ORDER BY date ASC`,
    [studentId, fromDate, toDate],
  );
}

export async function markPlanEntryComplete(id: string, studentId: string): Promise<StudyPlanEntryRow | null> {
  return queryOne<StudyPlanEntryRow>(
    `UPDATE "StudyPlanEntry" SET completed = true WHERE id = $1 AND "studentId" = $2 RETURNING *`,
    [id, studentId],
  );
}

export async function createExamCountdown(
  studentId: string,
  examBoard: ExamBoard,
  examDate: Date,
  subjects: string[],
): Promise<ExamCountdownRow> {
  const row = await queryOne<ExamCountdownRow>(
    `INSERT INTO "ExamCountdown" ("studentId", "examBoard", "examDate", subjects)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [studentId, examBoard, examDate, subjects],
  );
  if (!row) throw new Error("Failed to create exam countdown");
  return row;
}

export async function listExamCountdowns(studentId: string): Promise<ExamCountdownRow[]> {
  return query<ExamCountdownRow>(
    `SELECT * FROM "ExamCountdown" WHERE "studentId" = $1 AND "examDate" >= now() ORDER BY "examDate" ASC`,
    [studentId],
  );
}
