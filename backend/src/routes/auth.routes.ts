import { Router } from "express";
import { z } from "zod";
import * as authService from "../services/auth.service";
import * as parentService from "../services/parent.service";
import { validate } from "../middleware/validate";
import { authLimiter } from "../middleware/rateLimiter";
import { requireAuth } from "../middleware/auth";
import { passport, configureGoogleStrategy } from "../config/passport";
import { AppError } from "../lib/AppError";
import type { UserRow } from "../types/db";

const router = Router();
const googleEnabled = configureGoogleStrategy();

if (googleEnabled) {
  router.use(passport.initialize());
}

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).max(120),
  role: z.enum(["STUDENT", "PARENT", "TEACHER", "ADMIN"]),
  dateOfBirth: z.string().datetime().optional().or(z.string().date().optional()),
  gradeLevel: z.enum(["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"]).optional(),
  // Accept both "JAMB" and "JAMB UTME" from older clients — normalize to "JAMB"
  examBoards: z
    .array(z.string())
    .transform((arr) =>
      arr.map((e) => (e === "JAMB UTME" ? "JAMB" : e))
    )
    .pipe(
      z.array(z.enum(["WAEC", "JAMB", "NECO", "NABTEB", "GCSE", "SAT"]))
    )
    .optional(),
  school: z.string().optional(),
  parentEmail: z.string().email().optional(),
});

router.post("/register", authLimiter, validate({ body: registerSchema }), async (req, res, next) => {
  try {
    const { user, tokens, requiresParentConsent } = await authService.register(req.body);
    res.status(201).json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        tokens,
        requiresParentConsent,
      },
    });
  } catch (err) {
    next(err);
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/login", authLimiter, validate({ body: loginSchema }), async (req, res, next) => {
  try {
    const { user, tokens } = await authService.login(req.body.email, req.body.password);
    res.json({
      success: true,
      data: { user: { id: user.id, email: user.email, name: user.name, role: user.role }, tokens },
    });
  } catch (err) {
    next(err);
  }
});

const refreshSchema = z.object({ refreshToken: z.string().min(1) });

router.post("/refresh", validate({ body: refreshSchema }), async (req, res, next) => {
  try {
    const tokens = await authService.refresh(req.body.refreshToken);
    res.json({ success: true, data: { tokens } });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", validate({ body: refreshSchema }), async (req, res, next) => {
  try {
    await authService.logout(req.body.refreshToken);
    res.json({ success: true, data: { message: "Logged out" } });
  } catch (err) {
    next(err);
  }
});

router.post("/logout-all", requireAuth, async (req, res, next) => {
  try {
    await authService.logoutAllDevices(req.user!.userId);
    res.json({ success: true, data: { message: "Logged out of all devices" } });
  } catch (err) {
    next(err);
  }
});

const consentRequestSchema = z.object({ parentEmail: z.string().email() });

router.post("/consent/request", requireAuth, validate({ body: consentRequestSchema }), async (req, res, next) => {
  try {
    const consent = await parentService.requestConsent(req.user!.userId, req.body.parentEmail);
    res.status(201).json({ success: true, data: { requested: true, expiresAt: consent.expiresAt } });
  } catch (err) {
    next(err);
  }
});

const consentApproveSchema = z.object({ token: z.string().min(1) });

router.post("/consent/approve", validate({ body: consentApproveSchema }), async (req, res, next) => {
  try {
    const consent = await parentService.approveConsentByToken(req.body.token);
    res.json({ success: true, data: { status: consent.status, approvedAt: consent.approvedAt } });
  } catch (err) {
    next(err);
  }
});

router.get("/google", (req, res, next) => {
  if (!googleEnabled) {
    return next(AppError.badRequest("Google login is not configured on this server (missing GOOGLE_CLIENT_ID/SECRET)."));
  }
  passport.authenticate("google", { scope: ["profile", "email"], session: false })(req, res, next);
});

router.get("/google/callback", (req, res, next) => {
  if (!googleEnabled) {
    return next(AppError.badRequest("Google login is not configured on this server."));
  }
  passport.authenticate("google", { session: false, failureRedirect: "/login?error=google_failed" }, async (err: Error | null, user: UserRow | false) => {
    try {
      if (err || !user) {
        return next(err ?? AppError.unauthorized("Google authentication failed"));
      }
      const tokens = await authService.issueTokens(user.id, user.role);
      // In production, redirect to the frontend with tokens (e.g. as a short-lived
      // one-time code exchanged client-side), rather than returning JSON directly.
      // Returning JSON here keeps this testable without a frontend callback page.
      res.json({
        success: true,
        data: { user: { id: user.id, email: user.email, name: user.name, role: user.role }, tokens },
      });
    } catch (e) {
      next(e);
    }
  })(req, res, next);
});

export default router;
