import { Router } from "express";
import * as progressService from "../services/progress.service";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/overview", requireAuth, requireRole("STUDENT"), async (req, res, next) => {
  try {
    const overview = await progressService.getProgressOverview(req.user!.userId);
    res.json({ success: true, data: overview });
  } catch (err) {
    next(err);
  }
});

export default router;
