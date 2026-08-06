import express, { type Express, type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { env, isProduction } from "./config/env";

const app: Express = express();

// Replit's autoscale deployment terminates TLS and proxies to this process, so the
// client address arrives in X-Forwarded-For. Without this, req.ip is the proxy's
// address and every visitor shares one rate-limit bucket.
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

/**
 * CORS.
 *
 * Previously `cors()` with no arguments, which reflects any origin — acceptable for
 * a health check, not for an endpoint that spends money on every call. Now:
 *  - no configured origins  → cross-origin requests are refused, same-origin still
 *    works (browsers send no Origin header for same-origin requests). This is the
 *    production posture when the SPA is served from this host.
 *  - configured origins     → allowlist only, for split-host deployments.
 * In development the Vite dev server proxies /api, so requests are same-origin there
 * too and no allowlist entry is needed.
 */
const allowedOrigins = new Set(env.ASSISTANT_ALLOWED_ORIGINS);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(null, false);
    },
    methods: ["GET", "POST", "OPTIONS"],
    maxAge: 86_400,
  }),
);

/**
 * Baseline response headers. The SPA is a separate static build, so this only covers
 * API responses — but an API that reflects JSON should still refuse to be sniffed,
 * framed, or used as a referrer source.
 */
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  if (isProduction) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});

// 64kb is well above the assistant's validated ceiling (20 messages x 2000 chars)
// and stops an oversized body being parsed before validation can reject it.
app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true, limit: "64kb" }));

app.use("/api", router);

app.use((req, res) => {
  res.status(404).json({ code: "not_found", message: `Cannot ${req.method} ${req.path}` });
});

/**
 * Terminal error handler. Internal detail is logged, never returned — stack traces
 * and driver messages routinely leak paths and configuration.
 */
app.use((error: unknown, req: Request, res: Response, _next: NextFunction) => {
  req.log.error({ err: error }, "Unhandled request error");

  if (res.headersSent) {
    res.end();
    return;
  }

  const isBodyParseError =
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    (error as { type?: string }).type === "entity.too.large";

  if (isBodyParseError) {
    res.status(413).json({ code: "payload_too_large", message: "Request body is too large." });
    return;
  }

  res.status(500).json({ code: "internal_error", message: "Something went wrong." });
});

export default app;
