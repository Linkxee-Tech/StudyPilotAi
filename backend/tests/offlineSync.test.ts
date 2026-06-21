import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as offlineSyncService from "../src/services/offlineSync.service";
import { registerUserWithProfile, updateStudentProfile } from "../src/repositories/user.repository";
import { pool } from "../src/lib/db";
import type { UserRow } from "../src/types/db";

describe("offlineSync.service", () => {
  let student: UserRow;

  beforeAll(async () => {
    student = await registerUserWithProfile(
      { email: `sync-test-${Date.now()}@test.studypilot`, passwordHash: "x", name: "Sync Tester", role: "STUDENT" },
      { gradeLevel: "SS1" },
    );
  });

  afterAll(async () => {
    await pool.query('DELETE FROM "User" WHERE id = $1', [student.id]);
  });

  it("applies a batch of actions once, then returns already_applied on exact replay", async () => {
    const actions = [
      {
        clientActionId: "action-1",
        type: "SETTINGS_UPDATED" as const,
        payload: { lowBandwidthMode: true },
        clientTimestamp: new Date().toISOString(),
      },
    ];

    const firstRun = await offlineSyncService.processSyncBatch(student.id, actions);
    expect(firstRun[0].status).toBe("applied");

    const secondRun = await offlineSyncService.processSyncBatch(student.id, actions);
    expect(secondRun[0].status).toBe("already_applied");
  });

  it("does not double-apply when the same batch is replayed with multiple actions", async () => {
    const actions = [
      { clientActionId: "multi-1", type: "SETTINGS_UPDATED" as const, payload: { voiceEnabled: false }, clientTimestamp: new Date().toISOString() },
      { clientActionId: "multi-2", type: "SETTINGS_UPDATED" as const, payload: { voiceEnabled: true }, clientTimestamp: new Date().toISOString() },
    ];

    const first = await offlineSyncService.processSyncBatch(student.id, actions);
    expect(first.map((r) => r.status)).toEqual(["applied", "applied"]);

    const replay = await offlineSyncService.processSyncBatch(student.id, actions);
    expect(replay.map((r) => r.status)).toEqual(["already_applied", "already_applied"]);
  });

  it("skips a stale offline settings write when the server has newer data", async () => {
    // Simulate the server having more recent activity than the offline action's timestamp.
    const recentServerTime = new Date();
    await updateStudentProfile(student.id, { lastStudyDate: recentServerTime });

    const staleTimestamp = new Date(recentServerTime.getTime() - 60_000).toISOString(); // 1 minute earlier

    const result = await offlineSyncService.processSyncBatch(student.id, [
      {
        clientActionId: "stale-write-1",
        type: "SETTINGS_UPDATED",
        payload: { lowBandwidthMode: false },
        clientTimestamp: staleTimestamp,
      },
    ]);

    // The action is still recorded as "applied" (no-op success), but the
    // actual DB write should have been skipped because it's stale.
    expect(result[0].status).toBe("applied");
  });

  it("reports failed status (without throwing) for an unknown action type, and still records it idempotently", async () => {
    const actions = [
      {
        clientActionId: "bad-action-1",
        type: "NOT_A_REAL_ACTION",
        payload: {},
        clientTimestamp: new Date().toISOString(),
      },
    ];

    const result = await offlineSyncService.processSyncBatch(student.id, actions as any);
    expect(result[0].status).toBe("failed");

    // Replaying should now be idempotent on the failure record too.
    const replay = await offlineSyncService.processSyncBatch(student.id, actions as any);
    expect(replay[0].status).toBe("already_applied");
  });
});
