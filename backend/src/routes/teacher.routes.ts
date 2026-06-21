import { Router } from "express";
import { z } from "zod";
import * as classroomService from "../services/classroom.service";
import { validate } from "../middleware/validate";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

const createClassroomSchema = z.object({
  name: z.string().min(1).max(120),
  gradeLevel: z.enum(["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"]),
});

router.post("/classrooms", requireAuth, requireRole("TEACHER"), validate({ body: createClassroomSchema }), async (req, res, next) => {
  try {
    const classroom = await classroomService.createNewClassroom(req.user!.userId, req.body.name, req.body.gradeLevel);
    res.status(201).json({ success: true, data: classroom });
  } catch (err) {
    next(err);
  }
});

router.get("/classrooms", requireAuth, requireRole("TEACHER"), async (req, res, next) => {
  try {
    const classrooms = await classroomService.getTeacherClassrooms(req.user!.userId);
    res.json({ success: true, data: classrooms });
  } catch (err) {
    next(err);
  }
});

const rosterParamsSchema = z.object({ classroomId: z.string().uuid() });

router.get(
  "/classrooms/:classroomId/roster",
  requireAuth,
  requireRole("TEACHER"),
  validate({ params: rosterParamsSchema }),
  async (req, res, next) => {
    try {
      const roster = await classroomService.getClassroomRoster(req.params.classroomId, req.user!.userId);
      res.json({ success: true, data: roster });
    } catch (err) {
      next(err);
    }
  },
);

const joinSchema = z.object({ joinCode: z.string().min(1) });

router.post("/classrooms/join", requireAuth, requireRole("STUDENT"), validate({ body: joinSchema }), async (req, res, next) => {
  try {
    const membership = await classroomService.joinClassroomByCode(req.user!.userId, req.body.joinCode);
    res.status(201).json({ success: true, data: membership });
  } catch (err) {
    next(err);
  }
});

const goalParamsSchema = z.object({ classroomId: z.string().uuid() });
const goalBodySchema = z.object({
  title: z.string().min(1).max(200),
  subjectId: z.string().uuid().optional(),
  targetScore: z.coerce.number().int().min(0).max(100).optional(),
  dueDate: z.string().datetime().or(z.string().date()).optional(),
});

router.post(
  "/classrooms/:classroomId/goals",
  requireAuth,
  requireRole("TEACHER"),
  validate({ params: goalParamsSchema, body: goalBodySchema }),
  async (req, res, next) => {
    try {
      const goal = await classroomService.addGoal(
        req.params.classroomId,
        req.user!.userId,
        req.body.title,
        req.body.subjectId,
        req.body.targetScore,
        req.body.dueDate ? new Date(req.body.dueDate) : undefined,
      );
      res.status(201).json({ success: true, data: goal });
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  "/classrooms/:classroomId/goals",
  requireAuth,
  requireRole("TEACHER"),
  validate({ params: goalParamsSchema }),
  async (req, res, next) => {
    try {
      const goals = await classroomService.getGoals(req.params.classroomId);
      res.json({ success: true, data: goals });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
