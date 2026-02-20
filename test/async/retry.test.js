import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { requestWithRetry } from "@target/async/retry.js";

describe("requestWithRetry", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("retries until success", async () => {
    let count = 0;
    const fn = vi.fn(() => {
      count += 1;
      if (count < 3) return Promise.reject(new Error("Network error"));
      return Promise.resolve("Success!");
    });

    const promise = requestWithRetry(fn, { retries: 5, delay: 100, timeout: 50 });
    await vi.runAllTimersAsync();

    await expect(promise).resolves.toBe("Success!");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("rejects with timeout when retries exhausted", async () => {
    const fn = vi.fn(() => new Promise(() => {}));

    const promise = requestWithRetry(fn, { retries: 0, timeout: 50, delay: 10 });
    const assertion = expect(promise).rejects.toThrow("Timeout");
    await vi.advanceTimersByTimeAsync(50);

    await assertion;
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

