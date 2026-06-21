import { Router } from "express";
import { z } from "zod";
import { getStudentProfile, updateStudentProfile, setRetainAnswers, deleteUserAccount, findUserById } from "../repositories/user.repository";
import { validate } from "../middleware/validate";
import { requireAuth, requireRole } from "../middleware/auth";
import { AppError } from "../lib/AppError";
import { pool } from "../lib/db";

const router = Router();

router.get("/me", requireAuth, requireRole("STUDENT"), async (req, res, next) => {
  try {
    const profile = await getStudentProfile(req.user!.userId);
    if (!profile) throw AppError.notFound("Profile not found");
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
});

const updateSettingsSchema = z.object({
  dailyStudyMinutesGoal: z.coerce.number().int().min(10).max(600).optional(),
  defaultExplanationMode: z.enum(["BEGINNER", "STANDARD", "ADVANCED", "PIDGIN"]).optional(),
  lowBandwidthMode: z.boolean().optional(),
  voiceEnabled: z.boolean().optional(),
});

router.patch("/me", requireAuth, requireRole("STUDENT"), validate({ body: updateSettingsSchema }), async (req, res, next) => {
  try {
    const updated = await updateStudentProfile(req.user!.userId, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

const retainSchema = z.object({ retain: z.boolean() });

router.patch("/me/data-retention", requireAuth, validate({ body: retainSchema }), async (req, res, next) => {
  try {
    await setRetainAnswers(req.user!.userId, req.body.retain);
    res.json({ success: true, data: { retainAnswers: req.body.retain } });
  } catch (err) {
    next(err);
  }
});

/** GDPR data export: dumps every row across every table that references this user. */
router.get("/me/export", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const user = await findUserById(userId);
    if (!user) throw AppError.notFound("User not found");

    const tables = [
      "StudentProfile",
      "Quiz",
      "QuizAttemptAnswer",
      "HomeworkSession",
      "StudyPlanEntry",
      "ExamCountdown",
      "StudentAchievement",
      "StudentOfflineDownload",
      "ResourceGeneration",
      "Notification",
    ];

    const exportData: Record<string, unknown> = { user };
    for (const table of tables) {
      const column = table === "StudentProfile" ? "userId" : "studentId";
      try {
        const result = await pool.query(`SELECT * FROM "${table}" WHERE "${column}" = $1`, [userId]);
        exportData[table] = result.rows;
      } catch {
        // table may not have this column for non-student roles; skip gracefully
      }
    }

    res.json({ success: true, data: exportData });
  } catch (err) {
    next(err);
  }
});

router.delete("/me", requireAuth, async (req, res, next) => {
  try {
    await deleteUserAccount(req.user!.userId);
    res.json({ success: true, data: { deleted: true } });
  } catch (err) {
    next(err);
  }
});

export default router;
