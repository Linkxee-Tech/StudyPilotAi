import {
  createConsentRequest,
  findConsentByToken,
  approveConsent,
  linkParentToChild,
  listChildrenForParent,
  isParentOfChild,
} from "../repositories/parent.repository";
import { getProgressOverview } from "./progress.service";
import { AppError } from "../lib/AppError";

export async function requestConsent(studentId: string, parentEmail: string) {
  return createConsentRequest(studentId, parentEmail);
}

export async function approveConsentByToken(token: string) {
  const consent = await findConsentByToken(token);
  if (!consent) throw AppError.notFound("Consent request not found");
  if (consent.status === "APPROVED") return consent;
  if (consent.status === "EXPIRED" || new Date(consent.expiresAt) < new Date()) {
    throw AppError.badRequest("This consent link has expired. Please ask your child to request a new one.");
  }

  const approved = await approveConsent(token);
  if (!approved) throw AppError.internal("Failed to approve consent");
  return approved;
}

export async function linkChild(parentId: string, studentId: string) {
  return linkParentToChild(parentId, studentId);
}

export async function getMyChildren(parentId: string) {
  return listChildrenForParent(parentId);
}

export async function getChildProgress(parentId: string, studentId: string) {
  const isLinked = await isParentOfChild(parentId, studentId);
  if (!isLinked) throw AppError.forbidden("You are not linked to this student.");
  return getProgressOverview(studentId);
}
