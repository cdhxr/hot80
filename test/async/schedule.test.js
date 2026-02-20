import { describe, expect, it } from "vitest";
import { schedule } from "@target/async/schedule.js";

describe("schedule", () => {
  it("limits concurrency and keeps result order", async () => {
    let running = 0;
    let maxRunning = 0;

    const createTask = (value, delay) => () =>
      new Promise((resolve) => {
        running += 1;
        maxRunning = Math.max(maxRunning, running);
        setTimeout(() => {
          running -= 1;
          resolve(value);
        }, delay);
      });

    const tasks = [createTask("A", 30), createTask("B", 10), createTask("C", 20)];
    const result = await schedule(tasks, 2);

    expect(result).toEqual(["A", "B", "C"]);
    expect(maxRunning).toBe(2);
  });
});

