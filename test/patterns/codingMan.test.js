import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { codingMan } from "../../src/patterns/codingMan.js";

describe("codingMan", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("runs tasks in chain order", async () => {
    const logs = [];
    codingMan("Jack", (msg) => logs.push(msg)).eat("breakfast").sleep(2).eat("lunch");

    await vi.runAllTimersAsync();

    expect(logs).toEqual([
      "Hi, I am Jack",
      "Eat breakfast",
      "Sleep 2s...",
      "Wake up",
      "Eat lunch"
    ]);
  });

  it("supports sleepFirst", async () => {
    const logs = [];
    codingMan("Jack", (msg) => logs.push(msg)).sleepFirst(2).eat("breakfast");

    await vi.runAllTimersAsync();

    expect(logs).toEqual([
      "Sleep 2s...",
      "Wake up",
      "Hi, I am Jack",
      "Eat breakfast"
    ]);
  });
});
