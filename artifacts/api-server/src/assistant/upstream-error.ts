import { APIError } from "openai";

/**
 * Upstream failure diagnosis.
 *
 * The point of this module is that "the assistant is unavailable" must never be the
 * only thing anyone knows. Whatever the provider actually said is parsed, classified
 * and logged; only the visitor sees a generic message.
 *
 * Providers disagree about error shape. OpenAI returns `{ error: {...} }`. Google
 * returns a JSON *array*, `[{ error: {...} }]`, which the OpenAI SDK cannot parse —
 * that is why a real 429 with a 1.4 kB body carrying an exact quota name and retry
 * delay was reaching the logs as the useless string "429 status code (no body)".
 * `normaliseProviderBody` unwraps that at the fetch layer so the SDK, and everything
 * downstream of it, sees a shape it understands.
 */

export type FailureKind =
  | "quota"
  | "auth"
  | "model"
  | "endpoint"
  | "bad_request"
  | "timeout"
  | "network"
  | "server"
  | "empty_response"
  | "unknown";

export interface UpstreamDiagnosis {
  readonly kind: FailureKind;
  /** HTTP status from the provider, when the failure got that far. */
  readonly httpStatus?: number;
  /** Provider's own status string, e.g. `RESOURCE_EXHAUSTED`, `INVALID_ARGUMENT`. */
  readonly providerStatus?: string;
  readonly providerCode?: string;
  /** The provider's own message, verbatim. Operator-facing only. */
  readonly providerMessage?: string;
  /** Google `QuotaFailure` detail — names exactly which limit was hit. */
  readonly quotaId?: string;
  readonly quotaMetric?: string;
  readonly quotaValue?: string;
  /** Honours the provider's own retry hint when it gives one. */
  readonly retryAfterMs?: number;
  /** Whether retrying this exact request could ever succeed. */
  readonly retryable: boolean;
}

/**
 * Rewrites a provider error body into the `{ error: {...} }` shape the OpenAI SDK
 * expects. Returns the original text when no rewrite is needed.
 */
export function normaliseProviderBody(text: string): string {
  const trimmed = text.trimStart();
  if (!trimmed.startsWith("[")) return text;

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const first = parsed[0];
      if (first && typeof first === "object" && "error" in first) {
        return JSON.stringify(first);
      }
    }
  } catch {
    // Not JSON after all — hand it back untouched.
  }
  return text;
}

function parseDuration(value: unknown): number | undefined {
  // Google formats durations as protobuf strings: "3s", "33.58383538s".
  if (typeof value !== "string") return undefined;
  const match = /^([\d.]+)s$/.exec(value.trim());
  if (!match?.[1]) return undefined;
  const seconds = Number(match[1]);
  return Number.isFinite(seconds) ? Math.round(seconds * 1000) : undefined;
}

interface GoogleDetail {
  readonly "@type"?: string;
  readonly retryDelay?: string;
  readonly violations?: readonly {
    readonly quotaId?: string;
    readonly quotaMetric?: string;
    readonly quotaValue?: string;
  }[];
}

/** Classifies a thrown upstream error into something actionable. */
export function diagnoseUpstream(error: unknown): UpstreamDiagnosis {
  if (error instanceof Error && error.name === "APIConnectionTimeoutError") {
    return { kind: "timeout", retryable: true };
  }
  if (error instanceof Error && error.name === "APIConnectionError") {
    return { kind: "network", retryable: true };
  }

  if (!(error instanceof APIError)) {
    return { kind: "unknown", retryable: false };
  }

  const httpStatus = typeof error.status === "number" ? error.status : undefined;

  // `error.error` is the parsed provider payload, now reachable for Google too.
  const payload = (error.error ?? {}) as {
    message?: string;
    status?: string;
    code?: string | number;
    details?: readonly GoogleDetail[];
  };

  const providerMessage = payload.message ?? error.message;
  const providerStatus = typeof payload.status === "string" ? payload.status : undefined;
  const providerCode =
    payload.code !== undefined ? String(payload.code) : (error.code ?? undefined) ?? undefined;

  let quotaId: string | undefined;
  let quotaMetric: string | undefined;
  let quotaValue: string | undefined;
  let retryAfterMs: number | undefined;

  for (const detail of payload.details ?? []) {
    const type = detail["@type"] ?? "";
    if (type.includes("QuotaFailure")) {
      const violation = detail.violations?.[0];
      quotaId = violation?.quotaId;
      quotaMetric = violation?.quotaMetric;
      quotaValue = violation?.quotaValue;
    }
    if (type.includes("RetryInfo")) {
      retryAfterMs = parseDuration(detail.retryDelay);
    }
  }

  // A `Retry-After` header wins if the provider sent one.
  const headerRetry = error.headers?.get?.("retry-after");
  if (headerRetry) {
    const seconds = Number(headerRetry);
    if (Number.isFinite(seconds)) retryAfterMs = seconds * 1000;
  }

  const haystack = `${providerMessage ?? ""} ${providerStatus ?? ""}`.toLowerCase();

  const base = {
    httpStatus,
    providerStatus,
    providerCode,
    providerMessage,
    quotaId,
    quotaMetric,
    quotaValue,
    retryAfterMs,
  };

  if (httpStatus === 429 || providerStatus === "RESOURCE_EXHAUSTED") {
    /**
     * A *per-day* quota is not a rate limit — waiting out a backoff cannot clear it,
     * and retrying only burns the remainder of the allowance faster. Per-minute
     * limits are worth retrying; daily ones are a billing decision.
     */
    const perDay = /perday|per_day|daily/i.test(quotaId ?? "");
    return { ...base, kind: "quota", retryable: !perDay };
  }

  if (httpStatus === 401 || httpStatus === 403 || /api key not valid|unauthenticated|permission denied|invalid.*credential/.test(haystack)) {
    return { ...base, kind: "auth", retryable: false };
  }

  if (httpStatus === 402 || /insufficient.*(balance|quota|credit)|credit_balance/.test(haystack)) {
    return { ...base, kind: "quota", retryable: false };
  }

  if (httpStatus === 404 || /model.*(not found|not exist|no longer available)|is not supported/.test(haystack)) {
    return { ...base, kind: "model", retryable: false };
  }

  if (typeof httpStatus === "number" && httpStatus >= 500) {
    return { ...base, kind: "server", retryable: true };
  }

  if (httpStatus === 400) {
    // Visitor input is schema-validated before we ever call the provider, so a 400
    // here is a configuration fault: bad key (Gemini answers 400), unserved model,
    // or a parameter the provider rejects.
    if (/api key|api_key/.test(haystack)) return { ...base, kind: "auth", retryable: false };
    if (/model/.test(haystack)) return { ...base, kind: "model", retryable: false };
    return { ...base, kind: "bad_request", retryable: false };
  }

  return { ...base, kind: "unknown", retryable: false };
}

/** Structured, operator-facing log payload. Never contains the prompt or the key. */
export function toLogFields(diagnosis: UpstreamDiagnosis): Record<string, unknown> {
  return {
    upstreamKind: diagnosis.kind,
    upstreamHttpStatus: diagnosis.httpStatus,
    upstreamStatus: diagnosis.providerStatus,
    upstreamCode: diagnosis.providerCode,
    upstreamMessage: diagnosis.providerMessage,
    upstreamQuotaId: diagnosis.quotaId,
    upstreamQuotaMetric: diagnosis.quotaMetric,
    upstreamQuotaValue: diagnosis.quotaValue,
    upstreamRetryAfterMs: diagnosis.retryAfterMs,
    upstreamRetryable: diagnosis.retryable,
  };
}
