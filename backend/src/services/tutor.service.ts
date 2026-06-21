import { generateJSON } from "../lib/gemini";
import {
  buildTutorExplanationPrompt,
  buildStepLessonPrompt,
  type TutorExplanationParams,
  type TutorExplanationResponse,
  type StepLessonParams,
  type StepLessonResponse,
} from "../prompts/tutorPrompts";

const FALLBACK_EXPLANATION: TutorExplanationResponse = {
  definition: "We couldn't reach the AI tutor right now, but here's a starting point — try rephrasing your topic or check back in a moment.",
  keyConcepts: ["Our AI tutor is temporarily unavailable."],
  examples: [],
  analogy: "",
  realLifeApplication: "",
  summary: "Please try again shortly.",
};

const FALLBACK_LESSON: StepLessonResponse = {
  introduction: "Our AI tutor is temporarily unavailable.",
  conceptBreakdown: "Please try again in a moment.",
  workedExamples: "",
  commonMistakes: "",
  practiceQuestions: [],
  recap: "",
};

/**
 * Generates (or returns a cached) explanation for a topic in one of the four
 * modes (Beginner/Standard/Advanced/Pidgin). Cached because the same
 * topic+subject+grade+mode combination is requested by many students.
 */
export async function getTopicExplanation(params: TutorExplanationParams): Promise<TutorExplanationResponse> {
  const prompt = buildTutorExplanationPrompt(params);
  return generateJSON<TutorExplanationResponse>(prompt, {
    cacheType: "TUTOR_EXPLANATION",
    cacheKeyInput: params as unknown as Record<string, unknown>,
    fallback: JSON.stringify(FALLBACK_EXPLANATION),
    temperature: 0.6,
  });
}

/**
 * Generates the 6-part step-by-step lesson (Intro, Breakdown, Worked Examples,
 * Common Mistakes, Practice Questions, Recap) for a topic.
 */
export async function getStepByStepLesson(params: StepLessonParams): Promise<StepLessonResponse> {
  const prompt = buildStepLessonPrompt(params);
  return generateJSON<StepLessonResponse>(prompt, {
    cacheType: "STEP_LESSON",
    cacheKeyInput: params as unknown as Record<string, unknown>,
    fallback: JSON.stringify(FALLBACK_LESSON),
    temperature: 0.6,
  });
}
