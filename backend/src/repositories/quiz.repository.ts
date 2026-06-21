import { query, queryOne, withTransaction } from "../lib/db";
import type { QuizQuestionRow, QuizRow, QuizAttemptAnswerRow, QuizMode, QuestionType, Difficulty, ExamBoard } from "../types/db";

export interface CreateQuizQuestionInput {
  subjectId: string;
  topicId?: string | null;
  type: QuestionType;
  questionText: string;
  options: unknown;
  correctAnswer: unknown;
  explanation: string;
  difficulty: Difficulty;
  examBoard?: ExamBoard | null;
}

export async function insertQuizQuestions(questions: CreateQuizQuestionInput[]): Promise<QuizQuestionRow[]> {
  return withTransaction(async (client) => {
    const rows: QuizQuestionRow[] = [];
    for (const q of questions) {
      const result = await client.query<QuizQuestionRow>(
        `INSERT INTO "QuizQuestion" ("subjectId", "topicId", type, "questionText", options, "correctAnswer", explanation, difficulty, "examBoard")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          q.subjectId,
          q.topicId ?? null,
          q.type,
          q.questionText,
          JSON.stringify(q.options),
          JSON.stringify(q.correctAnswer),
          q.explanation,
          q.difficulty,
          q.examBoard ?? null,
        ],
      );
      rows.push(result.rows[0]);
    }
    return rows;
  });
}

export async function findQuizQuestionById(id: string): Promise<QuizQuestionRow | null> {
  return queryOne<QuizQuestionRow>('SELECT * FROM "QuizQuestion" WHERE id = $1', [id]);
}

export async function createQuiz(
  studentId: string,
  subjectId: string,
  mode: QuizMode,
  totalQuestions: number,
  topicId?: string | null,
): Promise<QuizRow> {
  const row = await queryOne<QuizRow>(
    `INSERT INTO "Quiz" ("studentId", "subjectId", "topicId", mode, "totalQuestions")
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [studentId, subjectId, topicId ?? null, mode, totalQuestions],
  );
  if (!row) throw new Error("Failed to create quiz");
  return row;
}

export async function recordQuizAnswer(
  quizId: string,
  questionId: string,
  studentAnswer: unknown,
  isCorrect: boolean,
  timeTakenSeconds?: number,
): Promise<QuizAttemptAnswerRow> {
  const row = await queryOne<QuizAttemptAnswerRow>(
    `INSERT INTO "QuizAttemptAnswer" ("quizId", "questionId", "studentAnswer", "isCorrect", "timeTakenSeconds")
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [quizId, questionId, JSON.stringify(studentAnswer), isCorrect, timeTakenSeconds ?? null],
  );
  if (!row) throw new Error("Failed to record quiz answer");
  return row;
}

export async function completeQuiz(quizId: string, score: number, xpEarned: number): Promise<QuizRow | null> {
  return queryOne<QuizRow>(
    `UPDATE "Quiz" SET "completedAt" = now(), score = $2, "xpEarned" = $3 WHERE id = $1 RETURNING *`,
    [quizId, score, xpEarned],
  );
}

export async function findQuizById(quizId: string): Promise<QuizRow | null> {
  return queryOne<QuizRow>('SELECT * FROM "Quiz" WHERE id = $1', [quizId]);
}

export async function listQuizAnswers(quizId: string): Promise<QuizAttemptAnswerRow[]> {
  return query<QuizAttemptAnswerRow>('SELECT * FROM "QuizAttemptAnswer" WHERE "quizId" = $1 ORDER BY "answeredAt" ASC', [quizId]);
}

export async function listRecentQuizzes(studentId: string, limit = 10): Promise<QuizRow[]> {
  return query<QuizRow>(
    `SELECT * FROM "Quiz" WHERE "studentId" = $1 AND "completedAt" IS NOT NULL
     ORDER BY "completedAt" DESC LIMIT $2`,
    [studentId, limit],
  );
}

/** Aggregate average score per subject for a student — backs the progress dashboard and weak-area detection. */
export async function getSubjectMastery(studentId: string): Promise<Array<{ subjectId: string; subjectName: string; avgScore: number; quizCount: number }>> {
  return query(
    `SELECT s.id as "subjectId", s.name as "subjectName",
            ROUND(AVG(q.score)) as "avgScore", COUNT(q.id) as "quizCount"
     FROM "Quiz" q
     JOIN "Subject" s ON s.id = q."subjectId"
     WHERE q."studentId" = $1 AND q."completedAt" IS NOT NULL
     GROUP BY s.id, s.name
     ORDER BY "avgScore" ASC`,
    [studentId],
  );
}
