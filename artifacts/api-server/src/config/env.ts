import { z } from "zod";

/**
 * Environment configuration.
 *
 * Parsed once at module load so a misconfigured deployment fails immediately with a
 * readable message rather than at the first request.
 *
 * `OPENAI_API_KEY` is deliberately optional: the marketing site must still build,
 * boot and serve without it. When the key is absent the assistant route reports
 * itself unavailable (503) instead of crashing the process — the rest of the site
 * is unaffected.
 */

const csv = (value: string): string[] =>
  value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  /** Secret. Never sent to the browser, never logged. */
  OPENAI_API_KEY: z.string().trim().min(1).optional(),

  // No safe default exists across providers: a model id is only meaningful for the
  // gateway `OPENAI_BASE_URL` points at. This default suits stock OpenAI; set
  // OPENAI_MODEL explicitly for anything else (`GET /v1/models` lists what a
  // gateway actually serves).
  OPENAI_MODEL: z.string().trim().min(1).default("gpt-5.4-mini"),

  /** Override for Azure OpenAI, a gateway, or a compatible provider. */
  OPENAI_BASE_URL: z.string().trim().url().optional(),

  /**
   * Models to fall back to, in order, when the primary is quota-exhausted or not
   * served. Comma separated; empty by default.
   *
   * Gemini's free tier meters 20 requests per day **per model**, so a single model
   * cannot keep a public page answering. Failover spreads load across separate
   * buckets. It is a mitigation, not a substitute for billing.
   */
  OPENAI_MODEL_FALLBACKS: z
    .string()
    .default("")
    .transform((value) =>
      value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
    ),

  /**
   * Thinking budget on models that reason before answering (Gemini 3.x, GPT-5,
   * o-series). Sent only when set, so providers that reject the field are unaffected.
   *
   * This is not a tuning nicety. On a reasoning model the thinking tokens are drawn
   * from the same budget as the answer: left at its default, Gemini 3.5/3.6 Flash
   * spent almost all of `max_tokens` thinking and the reply was cut off mid-sentence
   * after a single chunk. "low" leaves room for the answer and still reasons.
   */
  OPENAI_REASONING_EFFORT: z.enum(["none", "minimal", "low", "medium", "high"]).optional(),

  /** Upper bound on a single completion, guarding both latency and spend. */
  OPENAI_MAX_OUTPUT_TOKENS: z.coerce.number().int().min(64).max(8192).default(900),

  /** Per-request ceiling. The OpenAI client retries internally within this budget. */
  OPENAI_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120_000).default(45_000),

  /**
   * Retries after the first attempt, applied by `withRetries` in `assistant/openai.ts`
   * (the SDK's own retry is disabled so the two cannot compound). Only failures that
   * can actually clear are retried — a per-day quota is not one of them.
   */
  OPENAI_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(3),

  /**
   * Browser origins permitted to call the API. Empty means same-origin only, which
   * is the correct production posture when the SPA is served from this host.
   * In development the Vite dev server proxies /api, so no origin is needed there
   * either — this exists for split-host deployments.
   */
  ASSISTANT_ALLOWED_ORIGINS: z.string().default("").transform(csv),

  /** Sliding-window rate limit applied per client IP. */
  ASSISTANT_RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .min(1000)
    .default(60_000),
  ASSISTANT_RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(12),

  /**
   * Process-wide daily ceiling. A per-IP limit alone does not protect the API
   * budget against a distributed scrape, so this caps total spend as well.
   */
  ASSISTANT_DAILY_MAX_REQUESTS: z.coerce.number().int().min(1).default(2000),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment configuration:\n${issues}`);
}

export const env = parsed.data;

export const isProduction = env.NODE_ENV === "production";

/** Whether the assistant can actually reach a model. */
export const assistantEnabled = Boolean(env.OPENAI_API_KEY);
