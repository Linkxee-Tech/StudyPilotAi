import { Router } from "express";
import { z } from "zod";
import * as parentService from "../services/parent.service";
import { validate } from "../middleware/validate";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

const linkSchema = z.object({ studentId: z.string().uuid() });

router.post("/children/link", requireAuth, requireRole("PARENT"), validate({ body: linkSchema }), async (req, res, next) => {
  try {
    const link = await parentService.linkChild(req.user!.userId, req.body.studentId);
    res.status(201).json({ success: true, data: link });
  } catch (err) {
    next(err);
  }
});

router.get("/children", requireAuth, requireRole("PARENT"), async (req, res, next) => {
  try {
    const children = await parentService.getMyChildren(req.user!.userId);
    res.json({ success: true, data: children });
  } catch (err) {
    next(err);
  }
});

const progressParamsSchema = z.object({ studentId: z.string().uuid() });

router.get(
  "/children/:studentId/progress",
  requireAuth,
  requireRole("PARENT"),
  validate({ params: progressParamsSchema }),
  async (req, res, next) => {
    try {
      const progress = await parentService.getChildProgress(req.user!.userId, req.params.studentId);
      res.json({ success: true, data: progress });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
