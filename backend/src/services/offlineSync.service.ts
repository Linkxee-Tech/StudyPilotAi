import { recordSyncAction, findSyncAction } from "../repositories/offline.repository";
import { updateStudentProfile, getStudentProfile } from "../repositories/user.repository";
import { markPlanEntryComplete } from "../repositories/planner.repository";
import { submitAnswer, finishQuiz } from "./quiz.service";
import { logger } from "../lib/logger";

export type SyncActionType = "QUIZ_ANSWER_SUBMITTED" | "QUIZ_COMPLETED" | "STUDY_PLAN_ENTRY_COMPLETED" | "SETTINGS_UPDATED";

export interface SyncAction {
  clientActionId: string;
  type: SyncActionType;
  payload: Record<string, unknown>;
  clientTimestamp: string; // ISO date string — used for last-write-wins conflict resolution
}

export interface SyncResult {
  clientActionId: string;
  status: "applied" | "already_applied" | "failed";
  error?: string;
}

/**
 * Processes a batch of actions a student queued while offline, in order.
 * Idempotency: each (studentId, clientActionId) pair is recorded once in
 * SyncLogEntry — replaying the same batch (e.g. after a flaky connection)
 * is always safe and returns "already_applied" rather than double-counting XP.
 *
 * Conflict resolution: for fields that can also change on the server while
 * the client was offline (currently just student settings), we compare
 * clientTimestamp against the server's lastStudyDate-derived freshness and
 * only apply the offline change if it is the more recent write — a simple,
 * documented last-write-wins strategy appropriate for single-user settings.
 */
export async function processSyncBatch(studentId: string, actions: SyncAction[]): Promise<SyncResult[]> {
  const results: SyncResult[] = [];

  for (const action of actions) {
    const existing = await findSyncAction(studentId, action.clientActionId);
    if (existing) {
      results.push({ clientActionId: action.clientActionId, status: "already_applied" });
      continue;
    }

    try {
      await applyAction(studentId, action);
      await recordSyncAction(studentId, action.clientActionId, action.type, action.payload, true);
      results.push({ clientActionId: action.clientActionId, status: "applied" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      logger.warn("Sync action failed to apply", { studentId, action: action.type, error: message });
      await recordSyncAction(studentId, action.clientActionId, action.type, action.payload, false);
      results.push({ clientActionId: action.clientActionId, status: "failed", error: message });
    }
  }

  return results;
}

async function applyAction(studentId: string, action: SyncAction): Promise<void> {
  switch (action.type) {
    case "QUIZ_ANSWER_SUBMITTED": {
      const { quizId, questionId, studentAnswer, timeTakenSeconds } = action.payload as {
        quizId: string;
        questionId: string;
        studentAnswer: unknown;
        timeTakenSeconds?: number;
      };
      await submitAnswer(quizId, questionId, studentAnswer, timeTakenSeconds);
      return;
    }

    case "QUIZ_COMPLETED": {
      const { quizId } = action.payload as { quizId: string };
      await finishQuiz(quizId, studentId);
      return;
    }

    case "STUDY_PLAN_ENTRY_COMPLETED": {
      const { entryId } = action.payload as { entryId: string };
      await markPlanEntryComplete(entryId, studentId);
      return;
    }

    case "SETTINGS_UPDATED": {
      // Conflict resolution: only apply if this offline write is newer than
      // the last time we know the profile was touched server-side.
      const profile = await getStudentProfile(studentId);
      const serverLastTouch = profile?.lastStudyDate ? new Date(profile.lastStudyDate).getTime() : 0;
      const clientTime = new Date(action.clientTimestamp).getTime();

      if (clientTime < serverLastTouch) {
        logger.info("Skipping stale offline settings update (server has newer data)", { studentId });
        return; // stale write — server's version wins, action still marked as applied/no-op
      }

      const { defaultExplanationMode, lowBandwidthMode, voiceEnabled } = action.payload as Record<string, unknown>;
      await updateStudentProfile(studentId, {
        ...(defaultExplanationMode ? { defaultExplanationMode: defaultExplanationMode as any } : {}),
        ...(typeof lowBandwidthMode === "boolean" ? { lowBandwidthMode } : {}),
        ...(typeof voiceEnabled === "boolean" ? { voiceEnabled } : {}),
      });
      return;
    }

    default:
      throw new Error(`Unsupported sync action type: ${action.type}`);
  }
}
