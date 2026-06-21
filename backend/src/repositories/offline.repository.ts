import { query, queryOne } from "../lib/db";
import type { OfflinePackRow, StudentOfflineDownloadRow, SyncLogEntryRow, PackType } from "../types/db";

export async function listOfflinePacks(type?: PackType): Promise<OfflinePackRow[]> {
  if (type) {
    return query<OfflinePackRow>('SELECT * FROM "OfflinePack" WHERE type = $1 ORDER BY name ASC', [type]);
  }
  return query<OfflinePackRow>('SELECT * FROM "OfflinePack" ORDER BY name ASC');
}

export async function findOfflinePackByKey(key: string): Promise<OfflinePackRow | null> {
  return queryOne<OfflinePackRow>('SELECT * FROM "OfflinePack" WHERE key = $1', [key]);
}

export async function recordOfflineDownload(
  studentId: string,
  packId: string,
  version: number,
): Promise<StudentOfflineDownloadRow> {
  const row = await queryOne<StudentOfflineDownloadRow>(
    `INSERT INTO "StudentOfflineDownload" ("studentId", "packId", "downloadedVersion")
     VALUES ($1, $2, $3)
     ON CONFLICT ("studentId", "packId") DO UPDATE SET "downloadedVersion" = $3, "lastSyncedAt" = now()
     RETURNING *`,
    [studentId, packId, version],
  );
  if (!row) throw new Error("Failed to record offline download");
  return row;
}

export async function listStudentDownloads(studentId: string): Promise<Array<StudentOfflineDownloadRow & { pack: OfflinePackRow }>> {
  const rows = await query<any>(
    `SELECT sod.*, row_to_json(op.*) as pack
     FROM "StudentOfflineDownload" sod
     JOIN "OfflinePack" op ON op.id = sod."packId"
     WHERE sod."studentId" = $1`,
    [studentId],
  );
  return rows;
}

/**
 * Records a sync log entry idempotently keyed on (studentId, clientActionId).
 * Returns null if this exact action was already applied (the offline-sync
 * conflict-resolution path treats that as a no-op success).
 */
export async function recordSyncAction(
  studentId: string,
  clientActionId: string,
  actionType: string,
  payload: unknown,
  success: boolean,
): Promise<SyncLogEntryRow | null> {
  return queryOne<SyncLogEntryRow>(
    `INSERT INTO "SyncLogEntry" ("studentId", "clientActionId", "actionType", payload, success)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT ("studentId", "clientActionId") DO NOTHING
     RETURNING *`,
    [studentId, clientActionId, actionType, JSON.stringify(payload), success],
  );
}

export async function findSyncAction(studentId: string, clientActionId: string): Promise<SyncLogEntryRow | null> {
  return queryOne<SyncLogEntryRow>(
    `SELECT * FROM "SyncLogEntry" WHERE "studentId" = $1 AND "clientActionId" = $2`,
    [studentId, clientActionId],
  );
}
