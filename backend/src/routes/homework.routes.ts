import { Router } from "express";
import { z } from "zod";
import * as homeworkService from "../services/homework.service";
import { validate } from "../middleware/validate";
import { requireAuth, requireRole } from "../middleware/auth";
import { aiPromptLimiter } from "../middleware/rateLimiter";

const router = Router();

const startSchema = z.object({
  questionText: z.string().min(1).max(2000),
  subjectId: z.string().uuid().optional(),
  imageUrl: z.string().url().optional(),
});

router.post("/start", requireAuth, requireRole("STUDENT"), validate({ body: startSchema }), async (req, res, next) => {
  try {
    const session = await homeworkService.startHomeworkSession(
      req.user!.userId,
      req.body.questionText,
      req.body.subjectId,
      req.body.imageUrl,
    );
    res.status(201).json({ success: true, data: session });
  } catch (err) {
    next(err);
  }
});

const hintSchema = z.object({
  sessionId: z.string().uuid(),
  subject: z.string().optional(),
  gradeLevel: z.enum(["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"]).optional(),
});

router.post("/hint", requireAuth, requireRole("STUDENT"), aiPromptLimiter, validate({ body: hintSchema }), async (req, res, next) => {
  try {
    const hint = await homeworkService.getNextHint(req.body.sessionId, req.user!.userId, req.body.subject, req.body.gradeLevel);
    res.json({ success: true, data: hint });
  } catch (err) {
    next(err);
  }
});

const resolveSchema = z.object({ sessionId: z.string().uuid() });

router.post("/resolve", requireAuth, requireRole("STUDENT"), validate({ body: resolveSchema }), async (req, res, next) => {
  try {
    await homeworkService.resolveHomeworkSession(req.body.sessionId, req.user!.userId);
    res.json({ success: true, data: { resolved: true } });
  } catch (err) {
    next(err);
  }
});

export default router;
