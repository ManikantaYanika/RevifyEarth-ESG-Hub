import pino from "pino";

import { env, isProduction } from "../config/env";

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
    // The OpenAI SDK attaches request context to its errors; without these the key
    // and the visitor's prompt could reach the log sink.
    "err.headers.authorization",
    "err.request.headers.authorization",
    "*.apiKey",
    "*.OPENAI_API_KEY",
  ],
  ...(isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }),
});
