import { Router } from "express";
import { z } from "zod";
import * as libraryService from "../services/library.service";
import { validate } from "../middleware/validate";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

const browseSchema = z.object({
  category: z.enum(["CORE", "SCIENCES", "ARTS_HUMANITIES", "COMMERCIAL", "TRADE_VOCATIONAL"]).optional(),
  level: z.enum(["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"]).optional(),
  search: z.string().optional(),
});

router.get("/subjects", validate({ query: browseSchema }), async (req, res, next) => {
  try {
    const subjects = await libraryService.browseSubjects(req.query as any);
    res.json({ success: true, data: subjects });
  } catch (err) {
    next(err);
  }
});

const topicsParamsSchema = z.object({ subjectId: z.string().uuid() });
const topicsQuerySchema = z.object({ level: z.enum(["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"]).optional() });

router.get(
  "/subjects/:subjectId/topics",
  validate({ params: topicsParamsSchema, query: topicsQuerySchema }),
  async (req, res, next) => {
    try {
      const topics = await libraryService.getSubjectTopics(req.params.subjectId, req.query.level as any);
      res.json({ success: true, data: topics });
    } catch (err) {
      next(err);
    }
  },
);

const enrollSchema = z.object({ subjectId: z.string().uuid() });

router.post("/subjects/enroll", requireAuth, requireRole("STUDENT"), validate({ body: enrollSchema }), async (req, res, next) => {
  try {
    await libraryService.enrollInSubject(req.user!.userId, req.body.subjectId);
    res.json({ success: true, data: { enrolled: true } });
  } catch (err) {
    next(err);
  }
});

router.get("/subjects/mine", requireAuth, requireRole("STUDENT"), async (req, res, next) => {
  try {
    const subjects = await libraryService.getMySubjects(req.user!.userId);
    res.json({ success: true, data: subjects });
  } catch (err) {
    next(err);
  }
});

const packsQuerySchema = z.object({ type: z.enum(["SUBJECT", "EXAM", "TOPIC"]).optional() });

router.get("/offline-packs", validate({ query: packsQuerySchema }), async (req, res, next) => {
  try {
    const packs = await libraryService.browseOfflinePacks(req.query.type as any);
    res.json({ success: true, data: packs });
  } catch (err) {
    next(err);
  }
});

const downloadSchema = z.object({ packKey: z.string().min(1) });

router.post("/offline-packs/download", requireAuth, requireRole("STUDENT"), validate({ body: downloadSchema }), async (req, res, next) => {
  try {
    const download = await libraryService.downloadPack(req.user!.userId, req.body.packKey);
    res.json({ success: true, data: download });
  } catch (err) {
    next(err);
  }
});

export default router;
