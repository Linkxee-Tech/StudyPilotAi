import { Router } from "express";
import { z } from "zod";
import * as resourceService from "../services/resource.service";
import { validate } from "../middleware/validate";
import { requireAuth, requireRole } from "../middleware/auth";
import { aiPromptLimiter } from "../middleware/rateLimiter";

const router = Router();

const generateSchema = z.object({
  topic: z.string().min(1).max(200),
  subject: z.string().min(1).max(100),
  gradeLevel: z.enum(["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"]),
  resourceType: z.enum(["NOTES", "FLASHCARDS", "CHEATSHEET", "MINDMAP", "QUESTIONS"]),
  subjectId: z.string().uuid().optional(),
  format: z.enum(["PDF", "DOCX", "INLINE"]).default("INLINE"),
});

router.post("/generate", requireAuth, requireRole("STUDENT"), aiPromptLimiter, validate({ body: generateSchema }), async (req, res, next) => {
  try {
    const { subjectId, format, ...params } = req.body;
    const content = await resourceService.generateResource(req.user!.userId, params, subjectId, format);
    res.status(201).json({ success: true, data: content });
  } catch (err) {
    next(err);
  }
});

router.get("/recent", requireAuth, requireRole("STUDENT"), async (req, res, next) => {
  try {
    const resources = await resourceService.getRecentResources(req.user!.userId);
    res.json({ success: true, data: resources });
  } catch (err) {
    next(err);
  }
});

export default router;
