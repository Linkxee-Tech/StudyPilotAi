import {
  createClassroom,
  listTeacherClassrooms,
  findClassroomByJoinCode,
  findClassroomById,
  addStudentToClassroom,
  listClassroomStudents,
  createLearningGoal,
  listClassroomGoals,
} from "../repositories/classroom.repository";
import { AppError } from "../lib/AppError";
import type { GradeLevel } from "../types/db";

export async function createNewClassroom(teacherId: string, name: string, gradeLevel: GradeLevel) {
  return createClassroom(teacherId, name, gradeLevel);
}

export async function getTeacherClassrooms(teacherId: string) {
  return listTeacherClassrooms(teacherId);
}

export async function joinClassroomByCode(studentId: string, joinCode: string) {
  const classroom = await findClassroomByJoinCode(joinCode);
  if (!classroom) throw AppError.notFound("Invalid classroom join code");
  return addStudentToClassroom(classroom.id, studentId);
}

export async function getClassroomRoster(classroomId: string, requestingTeacherId: string) {
  const classroom = await findClassroomById(classroomId);
  if (!classroom) throw AppError.notFound("Classroom not found");
  if (classroom.teacherId !== requestingTeacherId) throw AppError.forbidden();
  return listClassroomStudents(classroomId);
}

export async function addGoal(
  classroomId: string,
  teacherId: string,
  title: string,
  subjectId?: string,
  targetScore?: number,
  dueDate?: Date,
) {
  const classroom = await findClassroomById(classroomId);
  if (!classroom) throw AppError.notFound("Classroom not found");
  if (classroom.teacherId !== teacherId) throw AppError.forbidden();
  return createLearningGoal(classroomId, title, subjectId, targetScore, dueDate);
}

export async function getGoals(classroomId: string) {
  return listClassroomGoals(classroomId);
}
