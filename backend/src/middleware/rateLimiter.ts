import rateLimit, { Options } from "express-rate-limit";
import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { AppError } from "../lib/AppError";

function keyByUserOrIp(req: Request): string {
  return req.user?.userId ?? req.ip ?? "anonymous";
}

type RateLimitHandler = Options["handler"];

// Build rate-limiter using in-memory store (no Redis required).
// Works for single-process dev; in production, mount a RedisStore for distributed enforcement.
function makeLimiter(windowMs: number, limit: number, handler: RateLimitHandler) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: keyByUserOrIp,
    handler,
  });
}

/** General-purpose limiter for all API traffic: protects against abuse/scraping. */
export const generalLimiter = makeLimiter(
  15 * 60 * 1000,
  300,
  (_req: Request, _res: Response, next: NextFunction) =>
    next(AppError.tooManyRequests("Too many requests — please slow down.")),
);

/**
 * Per-spec requirement: cap AI prompt usage per user per day (default 100/day)
 * to control Gemini API cost and prevent abuse. Applied to all AI-workflow routes
 * (tutor, quiz generation, homework, resources, planner).
 */
export const aiPromptLimiter = makeLimiter(
  24 * 60 * 60 * 1000,
  env.RATE_LIMIT_PROMPTS_PER_DAY,
  (_req: Request, _res: Response, next: NextFunction) =>
    next(
      AppError.tooManyRequests(
        `You've reached today's AI usage limit (${env.RATE_LIMIT_PROMPTS_PER_DAY} prompts/day). It resets at midnight — or upgrade to Pro for unlimited tutoring.`,
      ),
    ),
);

/** Stricter limiter for auth endpoints to slow down credential-stuffing/brute force. */
export const authLimiter = makeLimiter(
  15 * 60 * 1000,
  20,
  (_req: Request, _res: Response, next: NextFunction) =>
    next(AppError.tooManyRequests("Too many auth attempts — please wait before trying again.")),
);
