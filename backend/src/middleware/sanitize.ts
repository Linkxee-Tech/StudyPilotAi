import type { Request, Response, NextFunction } from "express";
import sanitizeHtml from "sanitize-html";

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [],
  allowedAttributes: {},
  disallowedTagsMode: "discard",
};

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return sanitizeHtml(value, SANITIZE_OPTIONS).trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = sanitizeValue(v);
    }
    return out;
  }
  return value;
}

/**
 * Strips HTML/script content from all string fields in the request body.
 * Applied globally — free-text fields (homework questions, contact messages,
 * classroom names, etc.) are the main risk surface for stored/reflected XSS.
 */
export function sanitizeBody(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }
  next();
}
