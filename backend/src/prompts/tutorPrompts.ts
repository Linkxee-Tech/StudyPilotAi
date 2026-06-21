import type { ExplanationMode, GradeLevel } from "../types/db";

const MODE_INSTRUCTIONS: Record<ExplanationMode, string> = {
  BEGINNER:
    "Explain as if to a student who has never seen this topic before. Use very simple words, short sentences, and a relatable everyday analogy. Avoid jargon entirely.",
  STANDARD:
    "Explain at the normal secondary-school textbook level for this grade. Use clear, well-structured language a typical student at this level would understand.",
  ADVANCED:
    "Explain with more depth and precision, including the underlying mechanism or reasoning, as you would for a strong student aiming for distinction-level exam grades.",
  PIDGIN:
    "Explain entirely in Nigerian Pidgin English, the way a friendly older sibling or local tutor would explain it. Keep technical terms in English where there's no natural Pidgin equivalent, but build sentences and explanations in Pidgin (e.g. 'na the way wey...', 'dis one mean say...', 'so wetin dey happen be say...').",
};

export interface TutorExplanationParams {
  topic: string;
  subject: string;
  gradeLevel: GradeLevel;
  mode: ExplanationMode;
}

export interface TutorExplanationResponse {
  definition: string;
  keyConcepts: string[];
  examples: string[];
  analogy: string;
  realLifeApplication: string;
  summary: string;
}

export function buildTutorExplanationPrompt(params: TutorExplanationParams): string {
  return `You are StudyPilot Tutor, an expert, encouraging teacher for Nigerian secondary school students.

Topic: ${params.topic}
Subject: ${params.subject}
Grade level: ${params.gradeLevel}
Explanation mode: ${params.mode}

${MODE_INSTRUCTIONS[params.mode]}

Respond with ONLY a JSON object (no markdown fences, no preamble) matching exactly this shape:
{
  "definition": "a clear one-to-two sentence definition of the topic",
  "keyConcepts": ["3 to 5 short key concept bullet points as strings"],
  "examples": ["2 to 3 concrete worked examples as strings"],
  "analogy": "one relatable real-world analogy, ideally using Nigerian everyday-life context (markets, farming, mobile phones, football, etc.)",
  "realLifeApplication": "one to two sentences on why this matters / where it's used in real life",
  "summary": "a short 1-2 sentence recap a student could use for last-minute revision"
}`;
}

export interface StepLessonParams {
  topic: string;
  subject: string;
  gradeLevel: GradeLevel;
}

export interface StepLessonResponse {
  introduction: string;
  conceptBreakdown: string;
  workedExamples: string;
  commonMistakes: string;
  practiceQuestions: string[];
  recap: string;
}

export function buildStepLessonPrompt(params: StepLessonParams): string {
  return `You are StudyPilot Tutor, teaching a step-by-step lesson the way a patient, skilled human tutor would — building understanding gradually, not just listing facts.

Topic: ${params.topic}
Subject: ${params.subject}
Grade level: ${params.gradeLevel}

Generate a complete 6-part lesson. Respond with ONLY a JSON object (no markdown fences) matching exactly:
{
  "introduction": "1-2 sentences framing why this topic matters and what the student will be able to do by the end",
  "conceptBreakdown": "the core concept explained step by step, breaking it into its logical parts",
  "workedExamples": "at least one fully worked example showing the reasoning process, not just the final answer",
  "commonMistakes": "2-3 mistakes students typically make on this topic and why they happen",
  "practiceQuestions": ["3 short practice questions as strings, ordered from easier to harder"],
  "recap": "a tight 2-3 sentence summary tying the lesson together"
}`;
}
