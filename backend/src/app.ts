import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { sanitizeBody } from "./middleware/sanitize";
import { generalLimiter } from "./middleware/rateLimiter";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";
import apiRoutes from "./routes";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: "2mb" })); // generous enough for homework text + small image URLs, not raw image uploads
  app.use(express.urlencoded({ extended: true }));

  app.use(
    morgan(env.NODE_ENV === "production" ? "combined" : "dev", {
      stream: { write: (msg: string) => logger.http(msg.trim()) },
    }),
  );

  app.use(sanitizeBody);
  app.use(generalLimiter);

  app.use("/api", apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
