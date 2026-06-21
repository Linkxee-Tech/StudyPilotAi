import { Router } from "express";
import { z } from "zod";
import * as offlineSyncService from "../services/offlineSync.service";
import { validate } from "../middleware/validate";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

const syncActionSchema = z.object({
  clientActionId: z.string().min(1),
  type: z.enum(["QUIZ_ANSWER_SUBMITTED", "QUIZ_COMPLETED", "STUDY_PLAN_ENTRY_COMPLETED", "SETTINGS_UPDATED"]),
  payload: z.record(z.string(), z.any()),
  clientTimestamp: z.string().datetime(),
});

const syncBatchSchema = z.object({
  actions: z.array(syncActionSchema).min(1).max(100),
});

router.post("/batch", requireAuth, requireRole("STUDENT"), validate({ body: syncBatchSchema }), async (req, res, next) => {
  try {
    const results = await offlineSyncService.processSyncBatch(req.user!.userId, req.body.actions);
    res.json({ success: true, data: { results } });
  } catch (err) {
    next(err);
  }
});

export default router;
