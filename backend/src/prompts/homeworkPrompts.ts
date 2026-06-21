import type { GradeLevel } from "../types/db";

export interface HomeworkHintParams {
  questionText: string;
  subject?: string;
  gradeLevel?: GradeLevel;
  /** How many hints have already been given for this session (0-indexed call count). */
  hintsAlreadyGiven: number;
}

export interface HomeworkHintResponse {
  hintLevel: number;
  hint: string;
  /** true once we've reached the final "full walkthrough" stage */
  isFinalStage: boolean;
  similarPracticeQuestion: string;
}

/**
 * Core pedagogical rule for the whole homework workflow: NEVER hand over the
 * final answer directly, even at the last hint stage — guide the student to
 * derive it themselves. This is enforced both in the prompt instructions and
 * checked again in homework.service.ts before the response is sent to the client.
 */
const ANTI_DIRECT_ANSWER_RULE = `CRITICAL RULE: Never state the final answer outright, at any hint level — not even at the last stage. Your job is to guide the student to work it out themselves. Ask a guiding question, point at the relevant concept, or show how to approach a SIMILAR problem — but the student must do the final step.`;

export function buildHomeworkHintPrompt(params: HomeworkHintParams): string {
  const stage = params.hintsAlreadyGiven; // 0 = first hint requested

  const stageInstruction =
    stage === 0
      ? "This is the FIRST hint. Identify which concept/topic this question is testing, in one sentence, then ask a guiding question that points the student toward the first step — do not solve anything yet."
      : stage === 1
        ? "This is the SECOND hint. Build on the first hint: show the general method or formula needed (in the abstract, not applied to this exact question), and ask the student to try applying it."
        : "This is a LATER hint. Walk through a fully worked SIMILAR example (with different numbers/wording from the student's actual question), step by step, so the student can mirror the method on their own question. Still do not solve their exact question.";

  return `You are StudyPilot's Homework Assistant. ${ANTI_DIRECT_ANSWER_RULE}

Student's question: "${params.questionText}"
${params.subject ? `Subject: ${params.subject}` : ""}
${params.gradeLevel ? `Grade level: ${params.gradeLevel}` : ""}

Hint stage: ${stage + 1} (0-indexed input: ${stage})
${stageInstruction}

Respond with ONLY a JSON object (no markdown fences):
{
  "hint": "the hint text for this stage, 2-4 sentences, encouraging in tone",
  "similarPracticeQuestion": "one new practice question testing the same concept, with different numbers or wording, that the student can try once they've solved their own"
}`;
}
