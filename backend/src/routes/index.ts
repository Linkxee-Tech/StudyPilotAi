import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "./auth.routes";
import tutorRoutes from "./tutor.routes";
import quizRoutes from "./quiz.routes";
import homeworkRoutes from "./homework.routes";
import libraryRoutes from "./library.routes";
import progressRoutes from "./progress.routes";
import plannerRoutes from "./planner.routes";
import resourcesRoutes from "./resources.routes";
import studentRoutes from "./student.routes";
import parentRoutes from "./parent.routes";
import teacherRoutes from "./teacher.routes";
import adminRoutes from "./admin.routes";
import syncRoutes from "./sync.routes";
import paymentRoutes from "./payment.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/tutor", tutorRoutes);
router.use("/quiz", quizRoutes);
router.use("/homework", homeworkRoutes);
router.use("/library", libraryRoutes);
router.use("/progress", progressRoutes);
router.use("/planner", plannerRoutes);
router.use("/resources", resourcesRoutes);
router.use("/student", studentRoutes);
router.use("/parent", parentRoutes);
router.use("/teacher", teacherRoutes);
router.use("/admin", adminRoutes);
router.use("/sync", syncRoutes);
router.use("/payment", paymentRoutes);

export default router;
