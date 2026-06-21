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
      req.body = targets.body.parse(req.body);
    }
    if (targets.query) {
      req.query = targets.query.parse(req.query) as any;
    }
    if (targets.params) {
      req.params = targets.params.parse(req.params) as any;
    }
    next();
  };
}
