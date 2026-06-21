import { query, queryOne } from "../lib/db";
import type { SubjectRow, TopicRow, GradeLevel, SubjectCategory } from "../types/db";

export async function listSubjects(filters?: { category?: SubjectCategory; level?: GradeLevel; search?: string }): Promise<SubjectRow[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters?.category) {
    params.push(filters.category);
    conditions.push(`category = $${params.length}`);
  }
  if (filters?.level) {
    params.push(filters.level);
    conditions.push(`$${params.length} = ANY(levels)`);
  }
  if (filters?.search) {
    params.push(`%${filters.search}%`);
    conditions.push(`name ILIKE $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  return query<SubjectRow>(`SELECT * FROM "Subject" ${where} ORDER BY name ASC`, params);
}

export async function findSubjectById(id: string): Promise<SubjectRow | null> {
  return queryOne<SubjectRow>('SELECT * FROM "Subject" WHERE id = $1', [id]);
}

export async function findSubjectByName(name: string): Promise<SubjectRow | null> {
  return queryOne<SubjectRow>('SELECT * FROM "Subject" WHERE name = $1', [name]);
}

export async function createSubject(
  name: string,
  category: SubjectCategory,
  levels: GradeLevel[],
  topicCount = 0,
): Promise<SubjectRow> {
  const row = await queryOne<SubjectRow>(
    `INSERT INTO "Subject" (name, category, levels, "topicCount") VALUES ($1, $2, $3, $4)
     ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, levels = EXCLUDED.levels, "topicCount" = EXCLUDED."topicCount"
     RETURNING *`,
    [name, category, levels, topicCount],
  );
  if (!row) throw new Error("Failed to create subject");
  return row;
}

export async function addStudentSubject(studentId: string, subjectId: string): Promise<void> {
  await query(
    `INSERT INTO "StudentSubject" ("studentId", "subjectId") VALUES ($1, $2)
     ON CONFLICT ("studentId", "subjectId") DO NOTHING`,
    [studentId, subjectId],
  );
}

export async function listStudentSubjects(studentId: string): Promise<SubjectRow[]> {
  return query<SubjectRow>(
    `SELECT s.* FROM "Subject" s
     JOIN "StudentSubject" ss ON ss."subjectId" = s.id
     WHERE ss."studentId" = $1
     ORDER BY s.name ASC`,
    [studentId],
  );
}

export async function listTopics(subjectId: string, level?: GradeLevel): Promise<TopicRow[]> {
  if (level) {
    return query<TopicRow>(
      `SELECT * FROM "Topic" WHERE "subjectId" = $1 AND level = $2 ORDER BY "order" ASC`,
      [subjectId, level],
    );
  }
  return query<TopicRow>(`SELECT * FROM "Topic" WHERE "subjectId" = $1 ORDER BY "order" ASC`, [subjectId]);
}

export async function createTopic(
  subjectId: string,
  title: string,
  level: GradeLevel,
  order = 0,
): Promise<TopicRow> {
  const row = await queryOne<TopicRow>(
    `INSERT INTO "Topic" ("subjectId", title, level, "order") VALUES ($1, $2, $3, $4) RETURNING *`,
    [subjectId, title, level, order],
  );
  if (!row) throw new Error("Failed to create topic");
  return row;
}
