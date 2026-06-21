import { Router } from "express";
import { z } from "zod";
import * as tutorService from "../services/tutor.service";
import { validate } from "../middleware/validate";
import { requireAuth, requireRole } from "../middleware/auth";
import { aiPromptLimiter } from "../middleware/rateLimiter";

const router = Router();

const gradeLevelEnum = z.enum(["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"]);

const explanationSchema = z.object({
  topic: z.string().min(1).max(200),
  subject: z.string().min(1).max(100),
  gradeLevel: gradeLevelEnum,
  mode: z.enum(["BEGINNER", "STANDARD", "ADVANCED", "PIDGIN"]),
});

router.post(
  "/explain",
  requireAuth,
  requireRole("STUDENT"),
  aiPromptLimiter,
  validate({ body: explanationSchema }),
  async (req, res, next) => {
    try {
      const explanation = await tutorService.getTopicExplanation(req.body);
      res.json({ success: true, data: explanation });
    } catch (err) {
      next(err);
    }
  },
);

const lessonSchema = z.object({
  topic: z.string().min(1).max(200),
  subject: z.string().min(1).max(100),
  gradeLevel: gradeLevelEnum,
});

router.post(
  "/lesson",
  requireAuth,
  requireRole("STUDENT"),
  aiPromptLimiter,
  validate({ body: lessonSchema }),
  async (req, res, next) => {
    try {
      const lesson = await tutorService.getStepByStepLesson(req.body);
      res.json({ success: true, data: lesson });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
