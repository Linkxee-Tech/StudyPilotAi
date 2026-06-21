import { generateJSON } from "../lib/gemini";
import { buildHomeworkHintPrompt, type HomeworkHintResponse } from "../prompts/homeworkPrompts";
import {
  createHomeworkSession,
  findHomeworkSession,
  incrementHintsGiven,
  markHomeworkResolved,
} from "../repositories/homework.repository";
import { AppError } from "../lib/AppError";
import type { GradeLevel, HomeworkSessionRow } from "../types/db";

const MAX_HINTS = 3;

const FALLBACK_HINT = {
  hint: "Our AI tutor is temporarily unavailable. In the meantime, try identifying what topic this question relates to and re-read your class notes on it.",
  similarPracticeQuestion: "",
};

export async function startHomeworkSession(
  studentId: string,
  questionText: string,
  subjectId?: string,
  imageUrl?: string,
): Promise<HomeworkSessionRow> {
  return createHomeworkSession(studentId, questionText, subjectId, imageUrl);
}

/**
 * Returns the next hint in the progression for a homework session.
 * The hint stage is driven entirely by the session's hintsGiven counter in
 * the database — a client cannot skip ahead and request "the answer" because
 * there is no endpoint that returns anything beyond a guided walkthrough;
 * the prompt itself is instructed to never reveal the final answer, at any stage.
 */
export async function getNextHint(
  sessionId: string,
  studentId: string,
  subject?: string,
  gradeLevel?: GradeLevel,
): Promise<HomeworkHintResponse> {
  const session = await findHomeworkSession(sessionId);
  if (!session) throw AppError.notFound("Homework session not found");
  if (session.studentId !== studentId) throw AppError.forbidden();

  const hintsAlreadyGiven = session.hintsGiven;
  const prompt = buildHomeworkHintPrompt({
    questionText: session.questionText,
    subject,
    gradeLevel,
    hintsAlreadyGiven,
  });

  const result = await generateJSON<{ hint: string; similarPracticeQuestion: string }>(prompt, {
    cacheType: "HOMEWORK_HINT",
    // Deliberately not caching by questionText alone — homework questions are
    // often unique per student, and we want each hint stage to be cache-keyed
    // distinctly anyway. We disable caching here by omitting cacheKeyInput.
    fallback: JSON.stringify(FALLBACK_HINT),
    temperature: 0.6,
  });

  const updated = await incrementHintsGiven(sessionId);
  const newHintCount = updated?.hintsGiven ?? hintsAlreadyGiven + 1;
  const isFinalStage = newHintCount >= MAX_HINTS;

  return {
    hintLevel: newHintCount,
    hint: result.hint,
    isFinalStage,
    similarPracticeQuestion: result.similarPracticeQuestion,
  };
}

export async function resolveHomeworkSession(sessionId: string, studentId: string): Promise<void> {
  const session = await findHomeworkSession(sessionId);
  if (!session) throw AppError.notFound("Homework session not found");
  if (session.studentId !== studentId) throw AppError.forbidden();
  await markHomeworkResolved(sessionId);
}
