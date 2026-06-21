import crypto from "crypto";
import { query, queryOne } from "../lib/db";
import type { ParentChildLinkRow, ParentConsentRow } from "../types/db";

export async function createConsentRequest(studentId: string, parentEmail: string, expiryDays = 7): Promise<ParentConsentRow> {
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiryDays);

  const row = await queryOne<ParentConsentRow>(
    `INSERT INTO "ParentConsent" (id, "studentId", "parentEmail", token, "expiresAt")
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [crypto.randomUUID(), studentId, parentEmail, token, expiresAt],
  );
  if (!row) throw new Error("Failed to create consent request");
  return row;
}

export async function findConsentByToken(token: string): Promise<ParentConsentRow | null> {
  return queryOne<ParentConsentRow>('SELECT * FROM "ParentConsent" WHERE token = $1', [token]);
}

export async function approveConsent(token: string): Promise<ParentConsentRow | null> {
  return queryOne<ParentConsentRow>(
    `UPDATE "ParentConsent" SET status = 'APPROVED', "approvedAt" = now()
     WHERE token = $1 AND status = 'PENDING' AND "expiresAt" > now()
     RETURNING *`,
    [token],
  );
}

export async function linkParentToChild(parentId: string, studentId: string): Promise<ParentChildLinkRow> {
  const row = await queryOne<ParentChildLinkRow>(
    `INSERT INTO "ParentChildLink" (id, "parentId", "studentId") VALUES ($1, $2, $3)
     ON CONFLICT ("parentId", "studentId") DO NOTHING RETURNING *`,
    [crypto.randomUUID(), parentId, studentId],
  );
  if (!row) throw new Error("This parent is already linked to this student");
  return row;
}

export async function listChildrenForParent(parentId: string): Promise<Array<{ userId: string; name: string; gradeLevel: string; school: string | null }>> {
  return query(
    `SELECT u.id as "userId", u.name, sp."gradeLevel", sp.school
     FROM "ParentChildLink" pcl
     JOIN "User" u ON u.id = pcl."studentId"
     JOIN "StudentProfile" sp ON sp."userId" = u.id
     WHERE pcl."parentId" = $1`,
    [parentId],
  );
}

export async function isParentOfChild(parentId: string, studentId: string): Promise<boolean> {
  const row = await queryOne(
    `SELECT 1 FROM "ParentChildLink" WHERE "parentId" = $1 AND "studentId" = $2`,
    [parentId, studentId],
  );
  return row !== null;
}
