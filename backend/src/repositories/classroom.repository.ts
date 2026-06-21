import crypto from "crypto";
import { query, queryOne } from "../lib/db";
import type { ClassroomRow, ClassroomMembershipRow, LearningGoalRow, GradeLevel } from "../types/db";

function generateJoinCode(): string {
  return "SP-" + crypto.randomBytes(3).toString("hex").toUpperCase();
}

export async function createClassroom(teacherId: string, name: string, gradeLevel: GradeLevel): Promise<ClassroomRow> {
  const row = await queryOne<ClassroomRow>(
    `INSERT INTO "Classroom" ("teacherId", name, "joinCode", "gradeLevel") VALUES ($1, $2, $3, $4) RETURNING *`,
    [teacherId, name, generateJoinCode(), gradeLevel],
  );
  if (!row) throw new Error("Failed to create classroom");
  return row;
}

export async function listTeacherClassrooms(teacherId: string): Promise<ClassroomRow[]> {
  return query<ClassroomRow>('SELECT * FROM "Classroom" WHERE "teacherId" = $1 ORDER BY "createdAt" DESC', [teacherId]);
}

export async function findClassroomByJoinCode(joinCode: string): Promise<ClassroomRow | null> {
  return queryOne<ClassroomRow>('SELECT * FROM "Classroom" WHERE "joinCode" = $1', [joinCode]);
}

export async function findClassroomById(id: string): Promise<ClassroomRow | null> {
  return queryOne<ClassroomRow>('SELECT * FROM "Classroom" WHERE id = $1', [id]);
}

export async function addStudentToClassroom(classroomId: string, studentId: string): Promise<ClassroomMembershipRow> {
  const row = await queryOne<ClassroomMembershipRow>(
    `INSERT INTO "ClassroomMembership" ("classroomId", "studentId") VALUES ($1, $2)
     ON CONFLICT ("classroomId", "studentId") DO NOTHING RETURNING *`,
    [classroomId, studentId],
  );
  if (!row) throw new Error("Student is already a member of this classroom");
  return row;
}

export async function listClassroomStudents(classroomId: string): Promise<Array<{ userId: string; name: string; email: string; xp: number; streakCount: number }>> {
  return query(
    `SELECT u.id as "userId", u.name, u.email, sp.xp, sp."streakCount"
     FROM "ClassroomMembership" cm
     JOIN "StudentProfile" sp ON sp."userId" = cm."studentId"
     JOIN "User" u ON u.id = sp."userId"
     WHERE cm."classroomId" = $1
     ORDER BY sp.xp DESC`,
    [classroomId],
  );
}

export async function createLearningGoal(
  classroomId: string,
  title: string,
  subjectId?: string | null,
  targetScore?: number | null,
  dueDate?: Date | null,
): Promise<LearningGoalRow> {
  const row = await queryOne<LearningGoalRow>(
    `INSERT INTO "LearningGoal" ("classroomId", title, "subjectId", "targetScore", "dueDate")
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [classroomId, title, subjectId ?? null, targetScore ?? null, dueDate ?? null],
  );
  if (!row) throw new Error("Failed to create learning goal");
  return row;
}

export async function listClassroomGoals(classroomId: string): Promise<LearningGoalRow[]> {
  return query<LearningGoalRow>('SELECT * FROM "LearningGoal" WHERE "classroomId" = $1 ORDER BY "createdAt" DESC', [classroomId]);
}
