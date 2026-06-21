import { describe, it, expect, beforeEach } from "vitest";
import * as tutorService from "../src/services/tutor.service";
import { buildTutorExplanationPrompt, buildStepLessonPrompt } from "../src/prompts/tutorPrompts";
import { queueGeminiResponse, clearGeminiQueue } from "./helpers/mockGemini";

describe("tutor prompts", () => {
  it("includes explicit Pidgin instructions only for PIDGIN mode", () => {
    const pidginPrompt = buildTutorExplanationPrompt({
      topic: "Photosynthesis",
      subject: "Biology",
      gradeLevel: "SS1",
      mode: "PIDGIN",
    });
    expect(pidginPrompt).toContain("Pidgin");

    const standardPrompt = buildTutorExplanationPrompt({
      topic: "Photosynthesis",
      subject: "Biology",
      gradeLevel: "SS1",
      mode: "STANDARD",
    });
    expect(standardPrompt).not.toContain("Nigerian Pidgin English");
  });

  it("requests all required explanation fields (definitions, key concepts, examples, analogy, real-life application, summary)", () => {
    const prompt = buildTutorExplanationPrompt({
      topic: "Photosynthesis",
      subject: "Biology",
      gradeLevel: "SS1",
      mode: "BEGINNER",
    });
    for (const field of ["definition", "keyConcepts", "examples", "analogy", "realLifeApplication", "summary"]) {
      expect(prompt).toContain(field);
    }
  });

  it("requests all 6 step-lesson parts", () => {
    const prompt = buildStepLessonPrompt({ topic: "Photosynthesis", subject: "Biology", gradeLevel: "SS1" });
    for (const field of ["introduction", "conceptBreakdown", "workedExamples", "commonMistakes", "practiceQuestions", "recap"]) {
      expect(prompt).toContain(field);
    }
  });
});

describe("tutor.service", () => {
  beforeEach(() => clearGeminiQueue());

  it("returns a parsed explanation matching the expected shape for every mode", async () => {
    const modes: Array<"BEGINNER" | "STANDARD" | "ADVANCED" | "PIDGIN"> = ["BEGINNER", "STANDARD", "ADVANCED", "PIDGIN"];
    // Unique per test run so the Gemini cache (real Redis, persists across runs)
    // can never serve a stale hit instead of exercising the mocked call path.
    const uniqueTopic = `Photosynthesis-${Date.now()}-${Math.random()}`;

    for (const mode of modes) {
      const fake = {
        definition: `Definition in ${mode} mode`,
        keyConcepts: ["concept 1", "concept 2"],
        examples: ["example 1"],
        analogy: "some analogy",
        realLifeApplication: "some application",
        summary: "some summary",
      };
      queueGeminiResponse(fake);

      const result = await tutorService.getTopicExplanation({
        topic: uniqueTopic,
        subject: "Biology",
        gradeLevel: "SS1",
        mode,
      });

      expect(result.definition).toBe(fake.definition);
      expect(result.keyConcepts).toEqual(fake.keyConcepts);
    }
  });

  it("returns the 6-part step lesson shape", async () => {
    const fake = {
      introduction: "intro",
      conceptBreakdown: "breakdown",
      workedExamples: "examples",
      commonMistakes: "mistakes",
      practiceQuestions: ["q1", "q2", "q3"],
      recap: "recap",
    };
    queueGeminiResponse(fake);

    const uniqueTopic = `Photosynthesis-${Date.now()}-${Math.random()}`;
    const result = await tutorService.getStepByStepLesson({ topic: uniqueTopic, subject: "Biology", gradeLevel: "SS1" });
    expect(result).toEqual(fake);
    expect(result.practiceQuestions).toHaveLength(3);
  });
});
