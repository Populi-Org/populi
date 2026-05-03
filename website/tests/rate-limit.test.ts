import { describe, it, expect, beforeEach, vi } from "vitest";
import { getClientIp, isRateLimited } from "../app/api/chat/rate-limit";

describe("getClientIp", () => {
  it("returns the first IP from x-forwarded-for header", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "192.168.1.1, 10.0.0.1" },
    });
    expect(getClientIp(req)).toBe("192.168.1.1");
  });

  it("returns 'unknown' when x-forwarded-for is not present", () => {
    const req = new Request("http://localhost");
    expect(getClientIp(req)).toBe("unknown");
  });

  it("trims whitespace from the IP", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "  192.168.1.1  " },
    });
    expect(getClientIp(req)).toBe("192.168.1.1");
  });
});

describe("isRateLimited", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("allows the first request", () => {
    expect(isRateLimited("1.2.3.4")).toBe(false);
  });

  it("allows requests up to the limit", () => {
    const limit = 30;
    for (let i = 0; i < limit; i++) {
      expect(isRateLimited("1.2.3.5")).toBe(false);
    }
  });

  it("blocks requests after the limit is reached", () => {
    const limit = 30;
    for (let i = 0; i < limit; i++) {
      isRateLimited("1.2.3.6");
    }
    expect(isRateLimited("1.2.3.6")).toBe(true);
  });

  it("resets the limit after the window expires", () => {
    const limit = 30;
    for (let i = 0; i < limit; i++) {
      isRateLimited("1.2.3.7");
    }
    expect(isRateLimited("1.2.3.7")).toBe(true);

    vi.advanceTimersByTime(3600001);
    expect(isRateLimited("1.2.3.7")).toBe(false);
  });

  it("tracks different IPs independently", () => {
    const limit = 30;
    for (let i = 0; i < limit; i++) {
      isRateLimited("1.2.3.8");
    }
    expect(isRateLimited("1.2.3.8")).toBe(true);
    expect(isRateLimited("5.6.7.8")).toBe(false);
  });
});
