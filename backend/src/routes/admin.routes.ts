import { Router } from "express";
import { z } from "zod";
import * as adminService from "../services/admin.service";
import { validate } from "../middleware/validate";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.use(requireAuth, requireRole("ADMIN"));

const usersQuerySchema = z.object({
  role: z.enum(["STUDENT", "PARENT", "TEACHER", "ADMIN"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});

router.get("/users", validate({ query: usersQuerySchema }), async (req, res, next) => {
  try {
    const result = await adminService.getUsers(req.query as any);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

const userIdParamsSchema = z.object({ userId: z.string().uuid() });

router.post("/users/:userId/deactivate", validate({ params: userIdParamsSchema }), async (req, res, next) => {
  try {
    const user = await adminService.deactivateUser(req.params.userId);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

router.post("/users/:userId/reactivate", validate({ params: userIdParamsSchema }), async (req, res, next) => {
  try {
    const user = await adminService.reactivateUser(req.params.userId);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

router.get("/analytics", async (_req, res, next) => {
  try {
    const analytics = await adminService.getAnalyticsOverview();
    res.json({ success: true, data: analytics });
  } catch (err) {
    next(err);
  }
});

const moderationQuerySchema = z.object({
  action: z.enum(["AUTO_FILTERED", "FLAGGED", "BLOCKED", "APPROVED", "REMOVED"]).optional(),
});

router.get("/moderation", validate({ query: moderationQuerySchema }), async (req, res, next) => {
  try {
    const queue = await adminService.getModerationQueue(req.query.action as any);
    res.json({ success: true, data: queue });
  } catch (err) {
    next(err);
  }
});

const reviewParamsSchema = z.object({ flagId: z.string().uuid() });
const reviewBodySchema = z.object({
  action: z.enum(["AUTO_FILTERED", "FLAGGED", "BLOCKED", "APPROVED", "REMOVED"]),
});

router.post(
  "/moderation/:flagId/review",
  validate({ params: reviewParamsSchema, body: reviewBodySchema }),
  async (req, res, next) => {
    try {
      const flag = await adminService.reviewFlag(req.params.flagId, req.user!.userId, req.body.action);
      res.json({ success: true, data: flag });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
