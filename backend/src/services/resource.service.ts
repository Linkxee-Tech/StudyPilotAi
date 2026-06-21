import { generateJSON } from "../lib/gemini";
import { buildResourcePrompt, type ResourceGenerationParams } from "../prompts/resourcePrompts";
import { saveResourceGeneration, listRecentResources } from "../repositories/resource.repository";
import type { ResourceFormat } from "../types/db";

const FALLBACKS: Record<string, string> = {
  NOTES: JSON.stringify({
    title: "Service unavailable",
    definition: "Our AI resource generator is temporarily unavailable.",
    equationOrFormula: null,
    keyConcepts: [],
    factorsOrSteps: [],
    commonExamMistakes: [],
  }),
  FLASHCARDS: JSON.stringify([{ front: "Service unavailable", back: "Please try again shortly." }]),
  CHEATSHEET: JSON.stringify([{ term: "Service unavailable", definition: "Please try again shortly." }]),
  MINDMAP: JSON.stringify({ centralNode: "Service unavailable", branches: [] }),
  QUESTIONS: JSON.stringify(["Service unavailable — please try again shortly."]),
};

export async function generateResource(
  studentId: string,
  params: ResourceGenerationParams,
  subjectId?: string,
  format: ResourceFormat = "INLINE",
): Promise<unknown> {
  const prompt = buildResourcePrompt(params);
  const content = await generateJSON<unknown>(prompt, {
    cacheType: "RESOURCE_GEN",
    cacheKeyInput: params as unknown as Record<string, unknown>,
    fallback: FALLBACKS[params.resourceType],
    temperature: 0.6,
  });

  await saveResourceGeneration(studentId, params.topic, params.resourceType, content, subjectId, format);
  return content;
}

export async function getRecentResources(studentId: string, limit = 20) {
  return listRecentResources(studentId, limit);
}
