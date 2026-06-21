import { generateJSON, generateContent } from "../lib/gemini";
import { buildQuizGenerationPrompt, type QuizGenerationParams, type GeneratedQuizQuestion } from "../prompts/quizPrompts";
import {
  insertQuizQuestions,
  createQuiz,
  recordQuizAnswer,
  completeQuiz,
  findQuizById,
  listQuizAnswers,
  findQuizQuestionById,
  listRecentQuizzes,
  getSubjectMastery,
} from "../repositories/quiz.repository";
import { addXP, touchStreak, awardAchievement } from "../repositories/gamification.repository";
import { AppError } from "../lib/AppError";
import { logger } from "../lib/logger";
import type { QuizMode, QuestionType, Difficulty, ExamBoard, QuizQuestionRow } from "../types/db";

const FALLBACK_QUESTIONS: GeneratedQuizQuestion[] = [
  {
    type: "MCQ",
    questionText: "Our AI quiz generator is temporarily unavailable. Which of these is a placeholder option?",
    options: ["This one", "Not this", "Not this either", "Definitely not this"],
    correctAnswer: 0,
    explanation: "This is a fallback question shown when the AI service is unreachable — please try generating again shortly.",
    difficulty: "EASY",
  },
];

export async function generateQuizQuestions(params: QuizGenerationParams): Promise<GeneratedQuizQuestion[]> {
  const prompt = buildQuizGenerationPrompt(params);
  const questions = await generateJSON<GeneratedQuizQuestion[]>(prompt, {
    cacheType: "QUIZ_GEN",
    cacheKeyInput: params as unknown as Record<string, unknown>,
    fallback: JSON.stringify(FALLBACK_QUESTIONS),
    temperature: 0.8, // a bit more variety so repeated quizzes don't feel identical
  });

  if (!Array.isArray(questions) || questions.length === 0) {
    logger.warn("Quiz generation returned no questions, using fallback");
    return FALLBACK_QUESTIONS;
  }
  return questions;
}

export async function generateAndPersistQuiz(
  studentId: string,
  subjectId: string,
  params: QuizGenerationParams,
  mode: QuizMode,
  topicId?: string,
): Promise<{ quizId: string; questions: QuizQuestionRow[] }> {
  const generated = await generateQuizQuestions(params);

  const persisted = await insertQuizQuestions(
    generated.map((q) => ({
      subjectId,
      topicId: topicId ?? null,
      type: q.type,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      examBoard: params.examBoard ?? null,
    })),
  );

  const quiz = await createQuiz(studentId, subjectId, mode, persisted.length, topicId);

  return { quizId: quiz.id, questions: persisted };
}

/**
 * Grades a single answer against its question's stored correctAnswer.
 * MCQ/TRUE_FALSE: index equality. FILL_BLANK: case-insensitive trimmed match.
 * MATCHING: every left-term must map to its correct right-term.
 * SHORT_ANSWER: graded by a lightweight AI call against the model answer,
 * since exact string matching is meaningless for free text.
 */
export async function gradeAnswer(questionId: string, studentAnswer: unknown): Promise<{ isCorrect: boolean; explanation: string }> {
  const question = await findQuizQuestionById(questionId);
  if (!question) throw AppError.notFound("Quiz question not found");

  const explanation = question.explanation;

  switch (question.type) {
    case "MCQ":
    case "TRUE_FALSE": {
      const isCorrect = Number(studentAnswer) === Number(question.correctAnswer);
      return { isCorrect, explanation };
    }
    case "FILL_BLANK": {
      const expected = String(question.correctAnswer).trim().toLowerCase();
      const given = String(studentAnswer).trim().toLowerCase();
      return { isCorrect: expected === given, explanation };
    }
    case "MATCHING": {
      const expectedMap = question.correctAnswer as Record<string, string>;
      const givenMap = studentAnswer as Record<string, string>;
      const isCorrect = Object.entries(expectedMap).every(([k, v]) => givenMap?.[k] === v);
      return { isCorrect, explanation };
    }
    case "SHORT_ANSWER": {
      return gradeShortAnswerWithAI(question.questionText, String(question.correctAnswer), String(studentAnswer));
    }
    default:
      throw AppError.internal(`Unknown question type: ${question.type}`);
  }
}

async function gradeShortAnswerWithAI(
  questionText: string,
  modelAnswer: string,
  studentAnswer: string,
): Promise<{ isCorrect: boolean; explanation: string }> {
  const prompt = `You are grading a short-answer exam question for a Nigerian secondary school student.

Question: ${questionText}
Model answer (for grading reference): ${modelAnswer}
Student's answer: ${studentAnswer}

Judge leniently for partial correctness of the core idea — exact wording does not need to match. Respond with ONLY a JSON object:
{ "isCorrect": boolean, "feedback": "1-2 sentence explanation of what was right or missing" }`;

  try {
    const result = await generateJSON<{ isCorrect: boolean; feedback: string }>(prompt, {
      fallback: JSON.stringify({ isCorrect: false, feedback: "Could not auto-grade this answer right now — a teacher should review it." }),
      temperature: 0.3,
    });
    return { isCorrect: result.isCorrect, explanation: result.feedback };
  } catch {
    return { isCorrect: false, explanation: "Could not auto-grade this answer right now — a teacher should review it." };
  }
}

export async function submitAnswer(
  quizId: string,
  questionId: string,
  studentAnswer: unknown,
  timeTakenSeconds?: number,
): Promise<{ isCorrect: boolean; explanation: string }> {
  const { isCorrect, explanation } = await gradeAnswer(questionId, studentAnswer);
  await recordQuizAnswer(quizId, questionId, studentAnswer, isCorrect, timeTakenSeconds);
  return { isCorrect, explanation };
}

const XP_PER_CORRECT_ANSWER = 10;
const XP_PASS_BONUS = 20; // awarded if score >= 70%
const PASS_THRESHOLD = 70;

export async function finishQuiz(quizId: string, studentId: string): Promise<{
  score: number;
  xpEarned: number;
  totalXP: number;
  streak: number;
  newAchievements: string[];
}> {
  const quiz = await findQuizById(quizId);
  if (!quiz) throw AppError.notFound("Quiz not found");
  if (quiz.studentId !== studentId) throw AppError.forbidden();

  const answers = await listQuizAnswers(quizId);
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const score = quiz.totalQuestions > 0 ? Math.round((correctCount / quiz.totalQuestions) * 100) : 0;

  let xpEarned = correctCount * XP_PER_CORRECT_ANSWER;
  if (score >= PASS_THRESHOLD) xpEarned += XP_PASS_BONUS;

  await completeQuiz(quizId, score, xpEarned);
  const totalXP = await addXP(studentId, xpEarned);
  const streak = await touchStreak(studentId);

  const newAchievements: string[] = [];
  if (score === 100) {
    const awarded = await awardAchievement(studentId, "quiz-master");
    if (awarded) newAchievements.push("quiz-master");
  }
  if (streak === 7) {
    const awarded = await awardAchievement(studentId, "seven-day-streak");
    if (awarded) newAchievements.push("seven-day-streak");
  }

  return { score, xpEarned, totalXP, streak, newAchievements };
}

export async function getRecentQuizzes(studentId: string, limit = 10) {
  return listRecentQuizzes(studentId, limit);
}

export async function getMasteryReport(studentId: string) {
  return getSubjectMastery(studentId);
}
