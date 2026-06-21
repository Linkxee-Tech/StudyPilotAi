import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

interface ValidationTargets {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Validates and replaces req.body/query/params with the parsed (and thus
 * type-coerced/defaulted) result. Throws ZodError on failure, caught centrally
 * by errorHandler.ts.
 */
export function validate(targets: ValidationTargets) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (targets.body) {
      const parsed = targets.body.safeParse(req.body);
      if (!parsed.success) return next(parsed.error);
      req.body = parsed.data;
    }
    if (targets.query) {
      const parsed = targets.query.safeParse(req.query);
      if (!parsed.success) return next(parsed.error);
      req.query = parsed.data;
    }
    if (targets.params) {
      const parsed = targets.params.safeParse(req.params);
      if (!parsed.success) return next(parsed.error);
      req.params = parsed.data;
    }
    next();
  };
}
