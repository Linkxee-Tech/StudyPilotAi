import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import * as homeworkService from "../src/services/homework.service";
import { buildHomeworkHintPrompt } from "../src/prompts/homeworkPrompts";
import { registerUserWithProfile } from "../src/repositories/user.repository";
import { findHomeworkSession } from "../src/repositories/homework.repository";
import { pool } from "../src/lib/db";
import { queueGeminiResponse, clearGeminiQueue } from "./helpers/mockGemini";
import type { UserRow } from "../src/types/db";

describe("homework hint prompt", () => {
  it("explicitly instructs the model to never reveal the final answer, at every stage", () => {
    for (const stage of [0, 1, 2, 5]) {
      const prompt = buildHomeworkHintPrompt({ questionText: "Solve for x: 2x + 4 = 10", hintsAlreadyGiven: stage });
      expect(prompt).toContain("Never state the final answer outright");
    }
  });

  it("escalates instruction content across stages (identify concept -> method -> worked similar example)", () => {
    const stage0 = buildHomeworkHintPrompt({ questionText: "Q", hintsAlreadyGiven: 0 });
    const stage1 = buildHomeworkHintPrompt({ questionText: "Q", hintsAlreadyGiven: 1 });
    const stage2 = buildHomeworkHintPrompt({ questionText: "Q", hintsAlreadyGiven: 2 });

    expect(stage0).toContain("FIRST hint");
    expect(stage1).toContain("SECOND hint");
    expect(stage2).toContain("worked SIMILAR example");
  });
});

describe("homework.service", () => {
  let student: UserRow;

  beforeAll(async () => {
    student = await registerUserWithProfile(
      { email: `homework-test-${Date.now()}@test.studypilot`, passwordHash: "x", name: "Homework Tester", role: "STUDENT" },
      { gradeLevel: "SS1" },
    );
  });

  afterAll(async () => {
    await pool.query('DELETE FROM "User" WHERE id = $1', [student.id]);
  });

  beforeEach(() => clearGeminiQueue());

  it("increments the hint stage in the database on each call, not client-controlled", async () => {
    const session = await homeworkService.startHomeworkSession(student.id, "Solve for x: 2x + 4 = 10");
    expect(session.hintsGiven).toBe(0);

    queueGeminiResponse({ hint: "Think about isolating x.", similarPracticeQuestion: "Solve 3x + 6 = 12" });
    const hint1 = await homeworkService.getNextHint(session.id, student.id);
    expect(hint1.hintLevel).toBe(1);
    expect(hint1.isFinalStage).toBe(false);

    const afterFirst = await findHomeworkSession(session.id);
    expect(afterFirst?.hintsGiven).toBe(1);

    queueGeminiResponse({ hint: "Subtract 4 from both sides, then divide.", similarPracticeQuestion: "Solve 3x + 6 = 12" });
    const hint2 = await homeworkService.getNextHint(session.id, student.id);
    expect(hint2.hintLevel).toBe(2);

    queueGeminiResponse({ hint: "Here's a worked similar example...", similarPracticeQuestion: "Solve 5x - 2 = 13" });
    const hint3 = await homeworkService.getNextHint(session.id, student.id);
    expect(hint3.hintLevel).toBe(3);
    expect(hint3.isFinalStage).toBe(true); // MAX_HINTS = 3
  });

  it("rejects getting a hint for a session belonging to another student", async () => {
    const session = await homeworkService.startHomeworkSession(student.id, "Some question");
    await expect(
      homeworkService.getNextHint(session.id, "00000000-0000-0000-0000-000000000000"),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it("marks a session resolved", async () => {
    const session = await homeworkService.startHomeworkSession(student.id, "Another question");
    await homeworkService.resolveHomeworkSession(session.id, student.id);
    const updated = await findHomeworkSession(session.id);
    expect(updated?.resolved).toBe(true);
  });
});
