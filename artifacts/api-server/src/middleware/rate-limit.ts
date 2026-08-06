import type { RequestHandler } from "express";

/**
 * In-process rate limiting.
 *
 * Two independent limits:
 *  - a per-IP sliding window, which stops one visitor monopolising the endpoint
 *  - a process-wide daily counter, which caps total API spend even under a
 *    distributed request pattern that defeats per-IP limiting
 *
 * LIMITATION — state is per process. Under `deploymentTarget = "autoscale"` each
 * instance keeps its own counters, so the effective limit is (limit × instances).
 * That is acceptable for a marketing-site assistant; a shared store (Redis) would be
 * required for a hard global guarantee.
 */

interface Window {
  /** Request timestamps inside the current window, oldest first. */
  hits: number[];
}

export interface RateLimitOptions {
  readonly windowMs: number;
  readonly max: number;
  readonly dailyMax: number;
}

export interface RateLimitResult {
  readonly allowed: boolean;
  readonly reason?: "per-ip" | "daily";
  readonly retryAfterSeconds: number;
  readonly remaining: number;
}

const DAY_MS = 86_400_000;

/** Bound on tracked clients, so a spray of unique IPs cannot grow the map without limit. */
const MAX_TRACKED_CLIENTS = 10_000;

export function createRateLimiter(options: RateLimitOptions) {
  const windows = new Map<string, Window>();
  let dailyCount = 0;
  let dailyResetAt = Date.now() + DAY_MS;

  const prune = (now: number): void => {
    for (const [key, window] of windows) {
      const cutoff = now - options.windowMs;
      window.hits = window.hits.filter((time) => time > cutoff);
      if (window.hits.length === 0) windows.delete(key);
    }
  };

  return function check(key: string): RateLimitResult {
    const now = Date.now();

    if (now >= dailyResetAt) {
      dailyCount = 0;
      dailyResetAt = now + DAY_MS;
    }

    if (dailyCount >= options.dailyMax) {
      return {
        allowed: false,
        reason: "daily",
        retryAfterSeconds: Math.ceil((dailyResetAt - now) / 1000),
        remaining: 0,
      };
    }

    if (windows.size > MAX_TRACKED_CLIENTS) prune(now);

    const cutoff = now - options.windowMs;
    const window = windows.get(key) ?? { hits: [] };
    window.hits = window.hits.filter((time) => time > cutoff);

    if (window.hits.length >= options.max) {
      const oldest = window.hits[0] ?? now;
      windows.set(key, window);
      return {
        allowed: false,
        reason: "per-ip",
        retryAfterSeconds: Math.max(1, Math.ceil((oldest + options.windowMs - now) / 1000)),
        remaining: 0,
      };
    }

    window.hits.push(now);
    windows.set(key, window);
    dailyCount += 1;

    return {
      allowed: true,
      retryAfterSeconds: 0,
      remaining: options.max - window.hits.length,
    };
  };
}

/**
 * Client key. `req.ip` honours Express's trust-proxy setting, which app.ts configures
 * for the Replit/autoscale front end. Falls back to the socket address so a
 * misconfigured proxy degrades to a shared bucket rather than to no limit at all.
 */
export function clientKey(req: Parameters<RequestHandler>[0]): string {
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}
