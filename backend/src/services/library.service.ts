import { listSubjects, findSubjectById, addStudentSubject, listStudentSubjects, listTopics } from "../repositories/subject.repository";
import { listOfflinePacks, findOfflinePackByKey, recordOfflineDownload } from "../repositories/offline.repository";
import { AppError } from "../lib/AppError";
import type { GradeLevel, SubjectCategory, PackType } from "../types/db";

export async function browseSubjects(filters?: { category?: SubjectCategory; level?: GradeLevel; search?: string }) {
  return listSubjects(filters);
}

export async function getSubjectTopics(subjectId: string, level?: GradeLevel) {
  const subject = await findSubjectById(subjectId);
  if (!subject) throw AppError.notFound("Subject not found");
  return listTopics(subjectId, level);
}

export async function enrollInSubject(studentId: string, subjectId: string) {
  const subject = await findSubjectById(subjectId);
  if (!subject) throw AppError.notFound("Subject not found");
  await addStudentSubject(studentId, subjectId);
}

export async function getMySubjects(studentId: string) {
  return listStudentSubjects(studentId);
}

export async function browseOfflinePacks(type?: PackType) {
  return listOfflinePacks(type);
}

export async function downloadPack(studentId: string, packKey: string) {
  const pack = await findOfflinePackByKey(packKey);
  if (!pack) throw AppError.notFound("Offline pack not found");
  return recordOfflineDownload(studentId, pack.id, pack.version);
}
