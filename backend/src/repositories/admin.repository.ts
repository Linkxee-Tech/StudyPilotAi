import { query, queryOne } from "../lib/db";
import type { UserRow, Role } from "../types/db";

export async function listUsers(filters?: { role?: Role; search?: string; limit?: number; offset?: number }): Promise<UserRow[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters?.role) {
    params.push(filters.role);
    conditions.push(`role = $${params.length}`);
  }
  if (filters?.search) {
    params.push(`%${filters.search}%`);
    conditions.push(`(name ILIKE $${params.length} OR email ILIKE $${params.length})`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit = filters?.limit ?? 50;
  const offset = filters?.offset ?? 0;
  params.push(limit, offset);

  return query<UserRow>(
    `SELECT * FROM "User" ${where} ORDER BY "createdAt" DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );
}

export async function countUsers(role?: Role): Promise<number> {
  const row = role
    ? await queryOne<{ count: string }>('SELECT count(*) FROM "User" WHERE role = $1', [role])
    : await queryOne<{ count: string }>('SELECT count(*) FROM "User"');
  return row ? parseInt(row.count, 10) : 0;
}

export async function setUserActive(userId: string, isActive: boolean): Promise<UserRow | null> {
  return queryOne<UserRow>(`UPDATE "User" SET "isActive" = $2 WHERE id = $1 RETURNING *`, [userId, isActive]);
}

export async function getPlatformStats(): Promise<{
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  quizzesCompletedToday: number;
  avgQuizScore: number | null;
}> {
  const [users, quizzesToday, avgScore] = await Promise.all([
    query<{ role: Role; count: string }>(`SELECT role, count(*) FROM "User" GROUP BY role`),
    queryOne<{ count: string }>(
      `SELECT count(*) FROM "Quiz" WHERE "completedAt" >= date_trunc('day', now())`,
    ),
    queryOne<{ avg: string | null }>(`SELECT AVG(score) as avg FROM "Quiz" WHERE "completedAt" IS NOT NULL`),
  ]);

  const counts: Record<string, number> = {};
  for (const row of users) counts[row.role] = parseInt(row.count, 10);

  return {
    totalUsers: Object.values(counts).reduce((a, b) => a + b, 0),
    totalStudents: counts.STUDENT ?? 0,
    totalTeachers: counts.TEACHER ?? 0,
    totalParents: counts.PARENT ?? 0,
    quizzesCompletedToday: quizzesToday ? parseInt(quizzesToday.count, 10) : 0,
    avgQuizScore: avgScore?.avg ? Math.round(parseFloat(avgScore.avg)) : null,
  };
}

export async function getTopSubjectsByActivity(limit = 6): Promise<Array<{ subject: string; sessions: number }>> {
  return query(
    `SELECT s.name as subject, count(q.id) as sessions
     FROM "Quiz" q JOIN "Subject" s ON s.id = q."subjectId"
     GROUP BY s.name ORDER BY sessions DESC LIMIT $1`,
    [limit],
  );
}
