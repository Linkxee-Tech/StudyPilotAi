export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = "AppError";
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(400, "BAD_REQUEST", message, details);
  }
  static unauthorized(message = "Authentication required") {
    return new AppError(401, "UNAUTHORIZED", message);
  }
  static forbidden(message = "You do not have permission to perform this action") {
    return new AppError(403, "FORBIDDEN", message);
  }
  static notFound(message = "Resource not found") {
    return new AppError(404, "NOT_FOUND", message);
  }
  static conflict(message: string) {
    return new AppError(409, "CONFLICT", message);
  }
  static tooManyRequests(message = "Rate limit exceeded") {
    return new AppError(429, "RATE_LIMITED", message);
  }
  static internal(message = "Internal server error", details?: unknown) {
    return new AppError(500, "INTERNAL_ERROR", message, details);
  }
  static aiUnavailable(message = "AI service is temporarily unavailable") {
    return new AppError(503, "AI_UNAVAILABLE", message);
  }
}
