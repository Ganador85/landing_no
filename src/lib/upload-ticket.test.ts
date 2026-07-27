import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { makeUploadTicket, verifyUploadTicket } from "@/lib/upload-ticket";

describe("upload tickets", () => {
  beforeEach(() => {
    vi.stubEnv("PAYLOAD_SECRET", "test-payload-secret-that-is-long-enough");
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-27T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it("makes a valid short-lived ticket", () => {
    const ticket = makeUploadTicket();

    expect(ticket).toMatch(/^up\.\d+\.[a-f0-9]{16}\.[a-f0-9]{32}$/);
    expect(verifyUploadTicket(ticket)).toBe(true);
  });

  it("rejects tampered and expired tickets", () => {
    const ticket = makeUploadTicket();
    const tampered = `${ticket.slice(0, -1)}${ticket.endsWith("0") ? "1" : "0"}`;

    expect(verifyUploadTicket(tampered)).toBe(false);

    vi.advanceTimersByTime(15 * 60 * 1_000 + 1);
    expect(verifyUploadTicket(ticket)).toBe(false);
  });
});
