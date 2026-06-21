import { query, queryOne } from "../lib/db";
import type { NotificationRow, ModerationFlagRow, ModerationAction } from "../types/db";

export async function createNotification(userId: string, type: string, title: string, body: string): Promise<NotificationRow> {
  const row = await queryOne<NotificationRow>(
    `INSERT INTO "Notification" ("userId", type, title, body) VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, type, title, body],
  );
  if (!row) throw new Error("Failed to create notification");
  return row;
}

export async function listNotifications(userId: string, unreadOnly = false): Promise<NotificationRow[]> {
  if (unreadOnly) {
    return query<NotificationRow>(
      `SELECT * FROM "Notification" WHERE "userId" = $1 AND "isRead" = false ORDER BY "createdAt" DESC`,
      [userId],
    );
  }
  return query<NotificationRow>(`SELECT * FROM "Notification" WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT 50`, [userId]);
}

export async function markNotificationRead(id: string, userId: string): Promise<void> {
  await query(`UPDATE "Notification" SET "isRead" = true WHERE id = $1 AND "userId" = $2`, [id, userId]);
}

export async function createModerationFlag(
  contentType: string,
  reason: string,
  action: ModerationAction,
  studentId?: string | null,
  contentRef?: string | null,
): Promise<ModerationFlagRow> {
  const row = await queryOne<ModerationFlagRow>(
    `INSERT INTO "ModerationFlag" ("contentType", reason, action, "studentId", "contentRef")
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [contentType, reason, action, studentId ?? null, contentRef ?? null],
  );
  if (!row) throw new Error("Failed to create moderation flag");
  return row;
}

export async function listModerationQueue(action?: ModerationAction): Promise<ModerationFlagRow[]> {
  if (action) {
    return query<ModerationFlagRow>('SELECT * FROM "ModerationFlag" WHERE action = $1 ORDER BY "createdAt" DESC', [action]);
  }
  return query<ModerationFlagRow>('SELECT * FROM "ModerationFlag" ORDER BY "createdAt" DESC LIMIT 100');
}

export async function reviewModerationFlag(id: string, reviewerId: string, newAction: ModerationAction): Promise<ModerationFlagRow | null> {
  return queryOne<ModerationFlagRow>(
    `UPDATE "ModerationFlag" SET action = $2, "reviewedBy" = $3, "reviewedAt" = now() WHERE id = $1 RETURNING *`,
    [id, newAction, reviewerId],
  );
}
