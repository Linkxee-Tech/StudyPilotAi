# Offline Sync Flow

StudyPilot AI is built for low-connectivity environments, so the student app is expected to queue actions locally (via IndexedDB/Dexie on the frontend) while offline and replay them through a single endpoint once connectivity returns: `POST /api/sync/batch`.

## Request shape

```json
{
  "actions": [
    {
      "clientActionId": "a stable id generated on-device, e.g. a UUID",
      "type": "QUIZ_ANSWER_SUBMITTED",
      "payload": { "quizId": "...", "questionId": "...", "studentAnswer": 2 },
      "clientTimestamp": "2026-06-15T10:32:00.000Z"
    }
  ]
}
```

## Idempotency

Every action carries a `clientActionId` generated on-device when the action was first queued (not when it's eventually sent). The server records `(studentId, clientActionId)` in `SyncLogEntry` with a unique constraint. If the same batch is replayed — e.g. the connection drops mid-sync and the client retries the whole batch — actions already recorded are skipped and reported back as `"already_applied"` rather than being re-applied. This matters most for XP-awarding actions like `QUIZ_COMPLETED`: without idempotency, a retried sync would double-award XP.

This is genuinely tested in `tests/offlineSync.test.ts`: the same batch is sent twice, and the second run's results are asserted to be `already_applied` for every action.

## Conflict resolution

The one case where the server's state and an offline action can legitimately disagree is `SETTINGS_UPDATED` (explanation mode, low-bandwidth mode, voice toggle) — a student could change settings on one device while another device's queued offline change is still in flight. The resolution rule is last-write-wins, compared against `StudentProfile.lastStudyDate` as a proxy for "the server has seen more recent activity than this offline write claims to be from." If the offline action's `clientTimestamp` predates that, the write is silently skipped (the action is still marked `applied` — it's a no-op success, not a failure) and the server's existing value wins.

This is a deliberately simple strategy, documented as such rather than oversold: it's appropriate for single-user preference fields, not a general CRDT. A future iteration for genuinely concurrent multi-device editing (e.g. study plan edits from two devices) would need per-field version vectors rather than a single timestamp comparison.

## Supported action types

| Type | Effect |
|---|---|
| `QUIZ_ANSWER_SUBMITTED` | Grades and records a single answer (reuses the same grading logic as the online path). |
| `QUIZ_COMPLETED` | Finalizes a quiz: score, XP, streak, achievements. |
| `STUDY_PLAN_ENTRY_COMPLETED` | Marks a planner entry done. |
| `SETTINGS_UPDATED` | Updates profile settings, subject to the conflict-resolution rule above. |

Unrecognized action types fail gracefully (recorded as `"failed"` in the sync log, with a per-action error message returned to the client) rather than throwing and aborting the rest of the batch — one bad action never blocks the others from applying.
