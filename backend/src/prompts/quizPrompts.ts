import type { Difficulty, ExamBoard, GradeLevel, QuestionType } from "../types/db";

export interface QuizGenerationParams {
  topic: string;
  subject: string;
  gradeLevel: GradeLevel;
  questionTypes: QuestionType[];
  count: number;
  difficulty: Difficulty;
  examBoard?: ExamBoard;
}

export interface GeneratedQuizQuestion {
  type: QuestionType;
  questionText: string;
  /** Present for MCQ / TRUE_FALSE / MATCHING; null for SHORT_ANSWER / FILL_BLANK */
  options: string[] | null;
  /** Index into options for MCQ/TRUE_FALSE, exact string for FILL_BLANK/SHORT_ANSWER, map for MATCHING */
  correctAnswer: number | string | Record<string, string>;
  explanation: string;
  difficulty: Difficulty;
}

const TYPE_GUIDANCE: Record<QuestionType, string> = {
  MCQ: '"options" is an array of exactly 4 plausible strings, "correctAnswer" is the 0-based index of the correct option (a number).',
  TRUE_FALSE: '"options" is exactly ["True", "False"], "correctAnswer" is 0 or 1 (a number).',
  FILL_BLANK: 'The question text must contain "___" where the blank goes. "options" is null. "correctAnswer" is the exact expected word or short phrase (a string).',
  SHORT_ANSWER: '"options" is null. "correctAnswer" is a model answer of 1-2 sentences (a string) used for grading guidance, not exact-match marking.',
  MATCHING: '"options" is an array of the right-hand items to match against. "correctAnswer" is an object mapping each left-hand term (in questionText, separated by "|") to its correct right-hand match from options.',
};

export function buildQuizGenerationPrompt(params: QuizGenerationParams): string {
  const examBoardLine = params.examBoard
    ? `Style the questions like genuine ${params.examBoard} past questions for this subject — same phrasing conventions, same level of difficulty calibration.`
    : "Style the questions like standard Nigerian secondary school continuous-assessment questions.";

  return `You are StudyPilot's quiz generation engine, creating real, exam-quality practice questions — never trivial or ambiguous.

Topic: ${params.topic}
Subject: ${params.subject}
Grade level: ${params.gradeLevel}
Difficulty: ${params.difficulty}
Question types to include: ${params.questionTypes.join(", ")}
Number of questions: ${params.count}
${examBoardLine}

Per-type formatting rules:
${params.questionTypes.map((t) => `- ${t}: ${TYPE_GUIDANCE[t]}`).join("\n")}

Every question must include a clear, instructive "explanation" (1-2 sentences) that teaches the underlying concept — the explanation is shown to the student after they answer, so make it genuinely useful, not just "the answer is X".

Respond with ONLY a JSON array (no markdown fences, no preamble) of exactly ${params.count} question objects, each matching:
{
  "type": "MCQ" | "TRUE_FALSE" | "FILL_BLANK" | "SHORT_ANSWER" | "MATCHING",
  "questionText": "string",
  "options": ["string", ...] or null,
  "correctAnswer": number | "string" | { "leftTerm": "rightMatch" },
  "explanation": "string",
  "difficulty": "EASY" | "MEDIUM" | "HARD"
}`;
}
