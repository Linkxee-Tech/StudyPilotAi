import { queryOne, query, withTransaction } from "../lib/db";
import type {
  UserRow,
  StudentProfileRow,
  ParentProfileRow,
  TeacherProfileRow,
  Role,
  GradeLevel,
  ExamBoard,
} from "../types/db";

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  return queryOne<UserRow>('SELECT * FROM "User" WHERE email = $1', [email]);
}

export async function findUserById(id: string): Promise<UserRow | null> {
  return queryOne<UserRow>('SELECT * FROM "User" WHERE id = $1', [id]);
}

export async function findUserByGoogleId(googleId: string): Promise<UserRow | null> {
  return queryOne<UserRow>('SELECT * FROM "User" WHERE "googleId" = $1', [googleId]);
}

export interface CreateUserInput {
  email: string;
  passwordHash: string | null;
  googleId?: string | null;
  name: string;
  role: Role;
  dateOfBirth?: Date | null;
}

export async function createUser(input: CreateUserInput): Promise<UserRow> {
  const row = await queryOne<UserRow>(
    `INSERT INTO "User" (email, "passwordHash", "googleId", name, role, "dateOfBirth")
     VALUES ($1, $2, $3, $4, $5::"Role", $6)
     RETURNING *`,
    [input.email, input.passwordHash, input.googleId ?? null, input.name, input.role, input.dateOfBirth ?? null],
  );
  if (!row) throw new Error("Failed to create user");
  return row;
}

export async function createStudentProfile(
  userId: string,
  gradeLevel: GradeLevel,
  examBoards: ExamBoard[] = [],
  school: string | null = null,
): Promise<StudentProfileRow> {
  const row = await queryOne<StudentProfileRow>(
    `INSERT INTO "StudentProfile" ("userId", "gradeLevel", "examBoards", school)
     VALUES ($1, $2::"GradeLevel", $3::"ExamBoard"[], $4)
     RETURNING *`,
    [userId, gradeLevel, examBoards, school],
  );
  if (!row) throw new Error("Failed to create student profile");
  return row;
}

export async function createParentProfile(userId: string): Promise<ParentProfileRow> {
  const row = await queryOne<ParentProfileRow>(
    `INSERT INTO "ParentProfile" ("userId") VALUES ($1) RETURNING *`,
    [userId],
  );
  if (!row) throw new Error("Failed to create parent profile");
  return row;
}

export async function createTeacherProfile(userId: string, school: string | null = null): Promise<TeacherProfileRow> {
  const row = await queryOne<TeacherProfileRow>(
    `INSERT INTO "TeacherProfile" ("userId", school) VALUES ($1, $2) RETURNING *`,
    [userId, school],
  );
  if (!row) throw new Error("Failed to create teacher profile");
  return row;
}

export async function getStudentProfile(userId: string): Promise<StudentProfileRow | null> {
  return queryOne<StudentProfileRow>('SELECT * FROM "StudentProfile" WHERE "userId" = $1', [userId]);
}

export async function updateStudentProfile(
  userId: string,
  updates: Partial<Pick<StudentProfileRow, "dailyStudyMinutesGoal" | "defaultExplanationMode" | "lowBandwidthMode" | "voiceEnabled" | "xp" | "streakCount" | "lastStudyDate">>,
): Promise<StudentProfileRow | null> {
  const fields = Object.keys(updates);
  if (fields.length === 0) return getStudentProfile(userId);

  const setClause = fields.map((f, i) => `"${f}" = $${i + 2}`).join(", ");
  const values = fields.map((f) => (updates as Record<string, unknown>)[f]);

  return queryOne<StudentProfileRow>(
    `UPDATE "StudentProfile" SET ${setClause} WHERE "userId" = $1 RETURNING *`,
    [userId, ...values],
  );
}

/** Registers a full user + role profile in a single transaction. */
export async function registerUserWithProfile(
  input: CreateUserInput,
  roleProfile?: { gradeLevel?: GradeLevel; examBoards?: ExamBoard[]; school?: string | null },
): Promise<UserRow> {
  return withTransaction(async (client) => {
    const userResult = await client.query<UserRow>(
      `INSERT INTO "User" (email, "passwordHash", "googleId", name, role, "dateOfBirth")
       VALUES ($1, $2, $3, $4, $5::"Role", $6) RETURNING *`,
      [input.email, input.passwordHash, input.googleId ?? null, input.name, input.role, input.dateOfBirth ?? null],
    );
    const user = userResult.rows[0];

    if (input.role === "STUDENT") {
      await client.query(
        `INSERT INTO "StudentProfile" ("userId", "gradeLevel", "examBoards", school)
         VALUES ($1, $2::"GradeLevel", $3::"ExamBoard"[], $4)`,
        [user.id, roleProfile?.gradeLevel ?? "SS1", roleProfile?.examBoards ?? [], roleProfile?.school ?? null],
      );
    } else if (input.role === "PARENT") {
      await client.query(`INSERT INTO "ParentProfile" ("userId") VALUES ($1)`, [user.id]);
    } else if (input.role === "TEACHER") {
      await client.query(`INSERT INTO "TeacherProfile" ("userId", school) VALUES ($1, $2)`, [
        user.id,
        roleProfile?.school ?? null,
      ]);
    }

    return user;
  });
}

export async function setRetainAnswers(userId: string, retain: boolean): Promise<void> {
  await query('UPDATE "User" SET "retainAnswers" = $2 WHERE id = $1', [userId, retain]);
}

export async function deleteUserAccount(userId: string): Promise<void> {
  // ON DELETE CASCADE on all child tables handles cleanup.
  await query('DELETE FROM "User" WHERE id = $1', [userId]);
}
