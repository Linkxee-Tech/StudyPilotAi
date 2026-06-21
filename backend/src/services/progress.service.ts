import { getSubjectMastery, listRecentQuizzes } from "../repositories/quiz.repository";
import { getStudentProfile } from "../repositories/user.repository";
import { listStudentAchievements, listAllAchievements } from "../repositories/gamification.repository";
import { AppError } from "../lib/AppError";

export async function getProgressOverview(studentId: string) {
  const [profile, mastery, recentQuizzes, earnedAchievements, allAchievements] = await Promise.all([
    getStudentProfile(studentId),
    getSubjectMastery(studentId),
    listRecentQuizzes(studentId, 10),
    listStudentAchievements(studentId),
    listAllAchievements(),
  ]);

  if (!profile) throw AppError.notFound("Student profile not found");

  const earnedKeys = new Set(earnedAchievements.map((a) => a.key));
  const achievements = allAchievements.map((a) => ({
    ...a,
    earned: earnedKeys.has(a.key),
    earnedAt: earnedAchievements.find((e) => e.key === a.key)?.earnedAt ?? null,
  }));

  const weakSubjects = mastery.filter((m) => m.avgScore < 50).map((m) => m.subjectName);

  return {
    xp: profile.xp,
    streakCount: profile.streakCount,
    mastery,
    weakSubjects,
    recentQuizzes,
    achievements,
  };
}
