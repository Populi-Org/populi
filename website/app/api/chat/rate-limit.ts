// Memory-safe rate limiter with automatic cleanup

const RATE_LIMIT_REQUESTS = Number(
  process.env.CHAT_RATE_LIMIT_REQUESTS || "30",
);
const RATE_LIMIT_WINDOW_MS = Number(
  process.env.CHAT_RATE_LIMIT_WINDOW_MS || "3600000",
);

interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    const valid = entry.timestamps.filter(
      (t) => now - t < RATE_LIMIT_WINDOW_MS,
    );
    if (valid.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      entry.timestamps = valid;
    }
  }
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return "unknown";
}

export function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Periodic cleanup: every ~100 calls or so
  if (rateLimitMap.size > 0 && Math.random() < 0.01) {
    cleanupExpiredEntries();
  }

  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { timestamps: [now] });
    return false;
  }

  const validTimestamps = entry.timestamps.filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );

  if (validTimestamps.length >= RATE_LIMIT_REQUESTS) {
    entry.timestamps = validTimestamps;
    return true;
  }

  validTimestamps.push(now);
  entry.timestamps = validTimestamps;
  return false;
}
