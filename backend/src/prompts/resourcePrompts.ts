import type { GradeLevel, ResourceType } from "../types/db";

export interface ResourceGenerationParams {
  topic: string;
  subject: string;
  gradeLevel: GradeLevel;
  resourceType: ResourceType;
}

export function buildResourcePrompt(params: ResourceGenerationParams): string {
  const { topic, subject, gradeLevel, resourceType } = params;
  const header = `You are StudyPilot's study resource generator, creating high-quality, exam-focused revision material.

Topic: ${topic}
Subject: ${subject}
Grade level: ${gradeLevel}
`;

  switch (resourceType) {
    case "NOTES":
      return (
        header +
        `Generate concise study notes. Respond with ONLY a JSON object:
{
  "title": "string",
  "definition": "string",
  "equationOrFormula": "string or null if not applicable",
  "keyConcepts": ["string", ...],
  "factorsOrSteps": ["string", ...],
  "commonExamMistakes": ["string", ...]
}`
      );

    case "FLASHCARDS":
      return (
        header +
        `Generate 6 flashcards covering the most exam-relevant facts about this topic. Respond with ONLY a JSON array:
[{ "front": "question or term", "back": "concise answer or definition" }, ...]`
      );

    case "CHEATSHEET":
      return (
        header +
        `Generate a quick-reference cheat sheet of the 6-8 most important terms/facts. Respond with ONLY a JSON array:
[{ "term": "string", "definition": "short one-line definition or fact" }, ...]`
      );

    case "MINDMAP":
      return (
        header +
        `Generate a mind map structure with the topic as the central node and 4 branches, each with 2-4 sub-points. Respond with ONLY a JSON object:
{
  "centralNode": "string",
  "branches": [{ "label": "string", "children": ["string", ...] }, ...]
}`
      );

    case "QUESTIONS":
      return (
        header +
        `Generate 5 revision questions of increasing difficulty, the kind that would appear in a real exam. Respond with ONLY a JSON array of strings:
["question 1", "question 2", ...]`
      );

    default:
      throw new Error(`Unsupported resource type: ${resourceType}`);
  }
}
