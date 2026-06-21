import { listUsers, countUsers, setUserActive, getPlatformStats, getTopSubjectsByActivity } from "../repositories/admin.repository";
import { listModerationQueue, reviewModerationFlag } from "../repositories/notification.repository";
import { AppError } from "../lib/AppError";
import type { Role, ModerationAction } from "../types/db";

export async function getUsers(filters?: { role?: Role; search?: string; page?: number; pageSize?: number }) {
  const pageSize = filters?.pageSize ?? 50;
  const page = filters?.page ?? 1;
  const [users, total] = await Promise.all([
    listUsers({ role: filters?.role, search: filters?.search, limit: pageSize, offset: (page - 1) * pageSize }),
    countUsers(filters?.role),
  ]);
  return { users, total, page, pageSize };
}

export async function deactivateUser(userId: string) {
  const updated = await setUserActive(userId, false);
  if (!updated) throw AppError.notFound("User not found");
  return updated;
}

export async function reactivateUser(userId: string) {
  const updated = await setUserActive(userId, true);
  if (!updated) throw AppError.notFound("User not found");
  return updated;
}

export async function getAnalyticsOverview() {
  const [stats, topSubjects] = await Promise.all([getPlatformStats(), getTopSubjectsByActivity()]);
  return { ...stats, topSubjects };
}

export async function getModerationQueue(action?: ModerationAction) {
  return listModerationQueue(action);
}

export async function reviewFlag(flagId: string, reviewerId: string, newAction: ModerationAction) {
  const updated = await reviewModerationFlag(flagId, reviewerId, newAction);
  if (!updated) throw AppError.notFound("Moderation flag not found");
  return updated;
}
