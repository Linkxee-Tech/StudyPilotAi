import { generateJSON } from "../lib/gemini";
import { buildStudyPlannerPrompt, type StudyPlannerParams, type PlannerDayEntry } from "../prompts/plannerPrompts";
import { insertStudyPlanEntries, listStudyPlanEntries, markPlanEntryComplete, createExamCountdown, listExamCountdowns } from "../repositories/planner.repository";
import { findSubjectByName } from "../repositories/subject.repository";
import type { ExamBoard } from "../types/db";

const FALLBACK_PLAN: PlannerDayEntry[] = [
  {
    dayOffset: 0,
    sessions: [{ subject: "General revision", topic: "Our AI planner is temporarily unavailable", type: "REVIEW", durationMinutes: 30 }],
  },
];

export async function generateStudyPlan(studentId: string, params: StudyPlannerParams): Promise<PlannerDayEntry[]> {
  const prompt = buildStudyPlannerPrompt(params);
  const plan = await generateJSON<PlannerDayEntry[]>(prompt, {
    cacheType: "STUDY_PLAN",
    // Plans are personalised per-student (weak subjects, exam countdown) so we
    // don't cache across students, but we do allow caching identical repeat
    // requests from the same student within the cache TTL.
    cacheKeyInput: { studentId, ...params } as unknown as Record<string, unknown>,
    fallback: JSON.stringify(FALLBACK_PLAN),
    temperature: 0.7,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const entries = [];
  for (const day of plan) {
    const date = new Date(today);
    date.setDate(date.getDate() + day.dayOffset);
    for (const session of day.sessions) {
      const subject = await findSubjectByName(session.subject);
      entries.push({
        studentId,
        date,
        subjectId: subject?.id ?? null,
        topicTitle: session.topic,
        type: session.type,
        durationMinutes: session.durationMinutes,
      });
    }
  }

  if (entries.length > 0) {
    await insertStudyPlanEntries(entries);
  }

  return plan;
}

export async function getWeekPlan(studentId: string, fromDate: Date) {
  const toDate = new Date(fromDate);
  toDate.setDate(toDate.getDate() + 7);
  return listStudyPlanEntries(studentId, fromDate, toDate);
}

export async function completePlanEntry(entryId: string, studentId: string) {
  return markPlanEntryComplete(entryId, studentId);
}

export async function addExamCountdown(studentId: string, examBoard: ExamBoard, examDate: Date, subjects: string[]) {
  return createExamCountdown(studentId, examBoard, examDate, subjects);
}

export async function getExamCountdowns(studentId: string) {
  const countdowns = await listExamCountdowns(studentId);
  const now = Date.now();
  return countdowns.map((c) => ({
    ...c,
    daysRemaining: Math.ceil((new Date(c.examDate).getTime() - now) / (1000 * 60 * 60 * 24)),
  }));
}
