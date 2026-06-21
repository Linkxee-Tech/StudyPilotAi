import { Router } from "express";
import { z } from "zod";
import * as plannerService from "../services/planner.service";
import { validate } from "../middleware/validate";
import { requireAuth, requireRole } from "../middleware/auth";
import { aiPromptLimiter } from "../middleware/rateLimiter";

const router = Router();

const generateSchema = z.object({
  subjects: z.array(z.string()).min(1),
  weakSubjects: z.array(z.string()).default([]),
  examBoard: z.enum(["WAEC", "JAMB", "NECO", "NABTEB", "GCSE", "SAT"]).optional(),
  daysUntilExam: z.coerce.number().int().min(0).optional(),
  dailyStudyMinutes: z.coerce.number().int().min(10).max(600),
  planLengthDays: z.coerce.number().int().min(1).max(30),
});

router.post("/generate", requireAuth, requireRole("STUDENT"), aiPromptLimiter, validate({ body: generateSchema }), async (req, res, next) => {
  try {
    const plan = await plannerService.generateStudyPlan(req.user!.userId, req.body);
    res.status(201).json({ success: true, data: plan });
  } catch (err) {
    next(err);
  }
});

const weekQuerySchema = z.object({ from: z.string().datetime().or(z.string().date()) });

router.get("/week", requireAuth, requireRole("STUDENT"), validate({ query: weekQuerySchema }), async (req, res, next) => {
  try {
    const entries = await plannerService.getWeekPlan(req.user!.userId, new Date(req.query.from as string));
    res.json({ success: true, data: entries });
  } catch (err) {
    next(err);
  }
});

const completeSchema = z.object({ entryId: z.string().uuid() });

router.post("/entries/complete", requireAuth, requireRole("STUDENT"), validate({ body: completeSchema }), async (req, res, next) => {
  try {
    const entry = await plannerService.completePlanEntry(req.body.entryId, req.user!.userId);
    res.json({ success: true, data: entry });
  } catch (err) {
    next(err);
  }
});

const countdownSchema = z.object({
  examBoard: z.enum(["WAEC", "JAMB", "NECO", "NABTEB", "GCSE", "SAT"]),
  examDate: z.string().datetime().or(z.string().date()),
  subjects: z.array(z.string()).min(1),
});

router.post("/exam-countdown", requireAuth, requireRole("STUDENT"), validate({ body: countdownSchema }), async (req, res, next) => {
  try {
    const countdown = await plannerService.addExamCountdown(
      req.user!.userId,
      req.body.examBoard,
      new Date(req.body.examDate),
      req.body.subjects,
    );
    res.status(201).json({ success: true, data: countdown });
  } catch (err) {
    next(err);
  }
});

router.get("/exam-countdown", requireAuth, requireRole("STUDENT"), async (req, res, next) => {
  try {
    const countdowns = await plannerService.getExamCountdowns(req.user!.userId);
    res.json({ success: true, data: countdowns });
  } catch (err) {
    next(err);
  }
});

export default router;
