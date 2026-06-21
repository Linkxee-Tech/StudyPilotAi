import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import crypto from "crypto";
import { env } from "../config/env";
import { redisGet, redisSet } from "./redis";
import { logger } from "./logger";
import { AppError } from "./AppError";
import type { CacheType } from "../types/db";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

// Maximum safety filtering per the data-privacy/content-safety requirement.
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
];

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;
const REQUEST_TIMEOUT_MS = 30_000;
const CACHE_TTL_SECONDS = 60 * 60 * 24; // 24h — balances cost savings vs staleness for educational content

export interface GenerateOptions {
  /** Used to build a stable cache key; pass the exact params that determine the output. */
  cacheKeyInput?: Record<string, unknown>;
  cacheType?: CacheType;
  /** If true, skip the cache read (but still write the result). Useful for "regenerate" actions. */
  forceRegenerate?: boolean;
  /** A plain-text fallback to return if Gemini is unavailable after retries. */
  fallback?: string;
  temperature?: number;
  jsonResponse?: boolean;
}

function buildCacheKey(prompt: string, extra?: Record<string, unknown>): string {
  const hash = crypto
    .createHash("sha256")
    .update(prompt + JSON.stringify(extra ?? {}))
    .digest("hex");
  return `gemini:cache:${hash}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Gemini request timed out after ${ms}ms`)), ms),
    ),
  ]);
}

/**
 * Calls Gemini with retry + exponential backoff, optional Redis caching,
 * and a documented fallback path if the model is unreachable after retries.
 * This is the single choke point all AI workflows (tutor, quiz, homework,
 * resources, planner) go through.
 */
export async function generateContent(prompt: string, options: GenerateOptions = {}): Promise<string> {
  const cacheKey = options.cacheKeyInput
    ? buildCacheKey(prompt, options.cacheKeyInput)
    : null;

  if (cacheKey && !options.forceRegenerate) {
    const cached = await redisGet(cacheKey);
    if (cached) {
      logger.debug("Gemini cache hit", { cacheType: options.cacheType });
      return cached;
    }
  }

  const model = genAI.getGenerativeModel({
    model: env.GEMINI_MODEL,
    safetySettings: SAFETY_SETTINGS,
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      responseMimeType: options.jsonResponse ? "application/json" : "text/plain",
    },
  });

  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await withTimeout(model.generateContent(prompt), REQUEST_TIMEOUT_MS);
      const text = result.response.text();

      if (!text || text.trim().length === 0) {
        throw new Error("Gemini returned an empty response");
      }

      if (cacheKey) {
        await redisSet(cacheKey, text, CACHE_TTL_SECONDS);
      }

      return text;
    } catch (err) {
      lastError = err;
      const isLastAttempt = attempt === MAX_RETRIES;
      logger.warn("Gemini call failed", {
        attempt: attempt + 1,
        maxRetries: MAX_RETRIES + 1,
        error: (err as Error).message,
        willRetry: !isLastAttempt,
      });

      if (!isLastAttempt) {
        const delay = BASE_DELAY_MS * 2 ** attempt + Math.random() * 100;
        await sleep(delay);
      }
    }
  }

  logger.error("Gemini call exhausted all retries", {
    error: (lastError as Error)?.message,
    cacheType: options.cacheType,
  });

  if (options.fallback) {
    return options.fallback;
  }

  throw AppError.aiUnavailable(
    "Our AI tutor is temporarily unavailable. Please try again in a moment.",
  );
}

/**
 * Convenience wrapper for prompts that expect a JSON object/array back.
 * Validates the response is parseable JSON; throws AppError.aiUnavailable
 * (or returns the fallback, if provided) on malformed output rather than
 * leaking a parse error to the client.
 */
export async function generateJSON<T>(prompt: string, options: GenerateOptions = {}): Promise<T> {
  const raw = await generateContent(prompt, { ...options, jsonResponse: true });
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    logger.error("Gemini returned malformed JSON", { raw: raw.slice(0, 200) });
    if (options.fallback) {
      return JSON.parse(options.fallback) as T;
    }
    throw AppError.aiUnavailable("The AI returned an unexpected response. Please try again.");
  }
}
