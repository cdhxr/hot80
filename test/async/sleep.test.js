import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sleep, sleepCancelable } from "../../src/async/sleep.js";

describe("sleep helpers", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sleep resolves after target time", async () => {
    const promise = sleep(1000);
    await vi.advanceTimersByTimeAsync(1000);
    await expect(promise).resolves.toBeUndefined();
  });

  it("sleepCancelable can stop resolution", async () => {
    let resolved = false;
    const promise = sleepCancelable(1000);
    promise.then(() => {
      resolved = true;
    });

    promise.cancel();
    await vi.advanceTimersByTimeAsync(1000);

    expect(resolved).toBe(false);
  });
});
