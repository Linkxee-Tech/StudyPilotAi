import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import * as quizService from "../src/services/quiz.service";
import { createSubject } from "../src/repositories/subject.repository";
import { insertQuizQuestions, createQuiz, listQuizAnswers } from "../src/repositories/quiz.repository";
import { registerUserWithProfile } from "../src/repositories/user.repository";
import { pool } from "../src/lib/db";
import { queueGeminiResponse, clearGeminiQueue } from "./helpers/mockGemini";
import type { SubjectRow, UserRow } from "../src/types/db";

describe("quiz.service grading", () => {
  let subject: SubjectRow;
  let student: UserRow;

  beforeAll(async () => {
    subject = await createSubject(`Test Subject ${Date.now()}`, "SCIENCES", ["SS1"]);
    student = await registerUserWithProfile(
      { email: `quiz-test-${Date.now()}@test.studypilot`, passwordHash: "x", name: "Quiz Tester", role: "STUDENT" },
      { gradeLevel: "SS1" },
    );
  });

  afterAll(async () => {
    await pool.query('DELETE FROM "User" WHERE id = $1', [student.id]);
    await pool.query('DELETE FROM "Subject" WHERE id = $1', [subject.id]);
  });

  beforeEach(() => clearGeminiQueue());

  it("grades MCQ correctly by index match", async () => {
    const [question] = await insertQuizQuestions([
      {
        subjectId: subject.id,
        type: "MCQ",
        questionText: "2 + 2 = ?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1,
        explanation: "Basic addition.",
        difficulty: "EASY",
      },
    ]);

    const correct = await quizService.gradeAnswer(question.id, 1);
    expect(correct.isCorrect).toBe(true);

    const incorrect = await quizService.gradeAnswer(question.id, 0);
    expect(incorrect.isCorrect).toBe(false);
  });

  it("grades TRUE_FALSE correctly", async () => {
    const [question] = await insertQuizQuestions([
      {
        subjectId: subject.id,
        type: "TRUE_FALSE",
        questionText: "Water boils at 100°C at sea level.",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Standard fact.",
        difficulty: "EASY",
      },
    ]);

    expect((await quizService.gradeAnswer(question.id, 0)).isCorrect).toBe(true);
    expect((await quizService.gradeAnswer(question.id, 1)).isCorrect).toBe(false);
  });

  it("grades FILL_BLANK case-insensitively and trims whitespace", async () => {
    const [question] = await insertQuizQuestions([
      {
        subjectId: subject.id,
        type: "FILL_BLANK",
        questionText: "The capital of Nigeria is ___.",
        options: null,
        correctAnswer: "Abuja",
        explanation: "Abuja is the capital.",
        difficulty: "EASY",
      },
    ]);

    expect((await quizService.gradeAnswer(question.id, "  abuja  ")).isCorrect).toBe(true);
    expect((await quizService.gradeAnswer(question.id, "ABUJA")).isCorrect).toBe(true);
    expect((await quizService.gradeAnswer(question.id, "Lagos")).isCorrect).toBe(false);
  });

  it("grades MATCHING requiring every pair to be correct", async () => {
    const [question] = await insertQuizQuestions([
      {
        subjectId: subject.id,
        type: "MATCHING",
        questionText: "A|B",
        options: ["1", "2"],
        correctAnswer: { A: "1", B: "2" },
        explanation: "Simple pairs.",
        difficulty: "MEDIUM",
      },
    ]);

    expect((await quizService.gradeAnswer(question.id, { A: "1", B: "2" })).isCorrect).toBe(true);
    // One pair wrong should fail the whole question.
    expect((await quizService.gradeAnswer(question.id, { A: "1", B: "1" })).isCorrect).toBe(false);
  });

  it("grades SHORT_ANSWER via the mocked AI grading call", async () => {
    const [question] = await insertQuizQuestions([
      {
        subjectId: subject.id,
        type: "SHORT_ANSWER",
        questionText: "Why is the sky blue?",
        options: null,
        correctAnswer: "Light scattering (Rayleigh scattering) of shorter blue wavelengths.",
        explanation: "Rayleigh scattering explanation.",
        difficulty: "MEDIUM",
      },
    ]);

    queueGeminiResponse({ isCorrect: true, feedback: "Correctly identifies scattering." });
    const result = await quizService.gradeAnswer(question.id, "Because of how light scatters in the atmosphere");
    expect(result.isCorrect).toBe(true);
  });

  it("computes final score, awards XP, and grants the quiz-master achievement on a perfect score", async () => {
    const questions = await insertQuizQuestions([
      { subjectId: subject.id, type: "MCQ", questionText: "Q1", options: ["a", "b"], correctAnswer: 0, explanation: "e", difficulty: "EASY" },
      { subjectId: subject.id, type: "MCQ", questionText: "Q2", options: ["a", "b"], correctAnswer: 1, explanation: "e", difficulty: "EASY" },
    ]);

    const quiz = await createQuiz(student.id, subject.id, "PRACTICE", questions.length);
    await quizService.submitAnswer(quiz.id, questions[0].id, 0); // correct
    await quizService.submitAnswer(quiz.id, questions[1].id, 1); // correct

    const result = await quizService.finishQuiz(quiz.id, student.id);
    expect(result.score).toBe(100);
    expect(result.xpEarned).toBeGreaterThan(0);
    expect(result.newAchievements).toContain("quiz-master");

    const answers = await listQuizAnswers(quiz.id);
    expect(answers.every((a) => a.isCorrect)).toBe(true);
  });

  it("rejects finishing a quiz that doesn't belong to the requesting student", async () => {
    const questions = await insertQuizQuestions([
      { subjectId: subject.id, type: "MCQ", questionText: "Q1", options: ["a", "b"], correctAnswer: 0, explanation: "e", difficulty: "EASY" },
    ]);
    const quiz = await createQuiz(student.id, subject.id, "PRACTICE", questions.length);

    await expect(quizService.finishQuiz(quiz.id, "00000000-0000-0000-0000-000000000000")).rejects.toMatchObject({
      statusCode: 403,
    });
  });
});
