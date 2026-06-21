import { Router } from "express";
import { z } from "zod";
import * as quizService from "../services/quiz.service";
import { validate } from "../middleware/validate";
import { requireAuth, requireRole } from "../middleware/auth";
import { aiPromptLimiter } from "../middleware/rateLimiter";
import { findSubjectByName, createSubject } from "../repositories/subject.repository";

const router = Router();

const gradeLevelEnum = z.enum(["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"]);
const questionTypeEnum = z.enum(["MCQ", "TRUE_FALSE", "FILL_BLANK", "SHORT_ANSWER", "MATCHING"]);

const generateSchema = z.object({
  subjectId: z.string().uuid().optional(),
  topicId: z.string().uuid().optional(),
  topic: z.string().min(1).max(200),
  subject: z.string().min(1).max(100),
  gradeLevel: gradeLevelEnum,
  questionTypes: z.array(questionTypeEnum).min(1),
  count: z.coerce.number().int().min(1).max(20),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  examBoard: z.enum(["WAEC", "JAMB", "NECO", "NABTEB", "GCSE", "SAT"]).optional(),
  mode: z.enum(["PRACTICE", "MOCK_EXAM", "WEAK_AREAS", "SPEED_ROUND"]),
});

router.post("/generate", requireAuth, requireRole("STUDENT"), aiPromptLimiter, validate({ body: generateSchema }), async (req, res, next) => {
  try {
    let { subjectId, topicId, mode, ...genParams } = req.body;
    if (!subjectId) {
      let subj = await findSubjectByName(genParams.subject);
      if (!subj) {
        subj = await createSubject(genParams.subject, "Core", ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"]);
      }
      subjectId = subj.id;
    }
    const result = await quizService.generateAndPersistQuiz(req.user!.userId, subjectId, genParams, mode, topicId);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

const submitAnswerSchema = z.object({
  quizId: z.string().uuid(),
  questionId: z.string().uuid(),
  studentAnswer: z.any(),
  timeTakenSeconds: z.coerce.number().int().min(0).optional(),
});

router.post("/answer", requireAuth, requireRole("STUDENT"), validate({ body: submitAnswerSchema }), async (req, res, next) => {
  try {
    const { quizId, questionId, studentAnswer, timeTakenSeconds } = req.body;
    const result = await quizService.submitAnswer(quizId, questionId, studentAnswer, timeTakenSeconds);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

const finishSchema = z.object({ quizId: z.string().uuid() });

router.post("/finish", requireAuth, requireRole("STUDENT"), validate({ body: finishSchema }), async (req, res, next) => {
  try {
    const result = await quizService.finishQuiz(req.body.quizId, req.user!.userId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

router.get("/recent", requireAuth, requireRole("STUDENT"), async (req, res, next) => {
  try {
    const quizzes = await quizService.getRecentQuizzes(req.user!.userId);
    res.json({ success: true, data: quizzes });
  } catch (err) {
    next(err);
  }
});

router.get("/mastery", requireAuth, requireRole("STUDENT"), async (req, res, next) => {
  try {
    const mastery = await quizService.getMasteryReport(req.user!.userId);
    res.json({ success: true, data: mastery });
  } catch (err) {
    next(err);
  }
});

export default router;
