import type { ExamBoard } from "../types/db";

export interface StudyPlannerParams {
  subjects: string[];
  weakSubjects: string[];
  examBoard?: ExamBoard;
  daysUntilExam?: number;
  dailyStudyMinutes: number;
  planLengthDays: number;
}

export interface PlannerDayEntry {
  dayOffset: number; // 0 = today
  sessions: Array<{
    subject: string;
    topic: string;
    type: "LESSON" | "QUIZ" | "REVISION" | "PRACTICE" | "MOCK_EXAM" | "REVIEW";
    durationMinutes: number;
  }>;
}

export function buildStudyPlannerPrompt(params: StudyPlannerParams): string {
  const examLine = params.examBoard
    ? `The student is preparing for ${params.examBoard}${params.daysUntilExam ? `, ${params.daysUntilExam} days away` : ""}. Weight revision and mock-exam sessions more heavily as the exam gets closer.`
    : "No specific exam is set — focus on steady, balanced progress across subjects.";

  return `You are StudyPilot's AI study planner, building a realistic, motivating daily schedule.

Subjects: ${params.subjects.join(", ")}
Weak subjects needing extra focus: ${params.weakSubjects.length ? params.weakSubjects.join(", ") : "none flagged"}
Available study time per day: ${params.dailyStudyMinutes} minutes
Plan length: ${params.planLengthDays} days
${examLine}

Rules:
- Total minutes per day must not exceed ${params.dailyStudyMinutes}.
- Weak subjects should appear more often than strong ones.
- Vary session types (LESSON, QUIZ, REVISION, PRACTICE, MOCK_EXAM, REVIEW) — don't repeat the same type every day.
- Topic names should be plausible, specific syllabus topics for each subject (not just the subject name).

Respond with ONLY a JSON array (no markdown fences) of exactly ${params.planLengthDays} day objects:
[{
  "dayOffset": 0,
  "sessions": [{ "subject": "string", "topic": "string", "type": "LESSON" | "QUIZ" | "REVISION" | "PRACTICE" | "MOCK_EXAM" | "REVIEW", "durationMinutes": number }]
}, ...]`;
}
