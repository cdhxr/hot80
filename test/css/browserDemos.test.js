// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  Carousel,
  TodoListApp,
  createProgressRingState,
  createTriangleStyle
} from "@target/css/browserDemos.js";

describe("css/browser demos", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("createTriangleStyle returns border-based triangle style", () => {
    const style = createTriangleStyle(8, "blue");
    expect(style).toEqual({
      width: "0",
      height: "0",
      borderLeft: "8px solid transparent",
      borderRight: "8px solid transparent",
      borderBottom: "16px solid blue"
    });
  });

  it("createProgressRingState computes svg ring values", () => {
    const ring = createProgressRingState(25, 100, 10);
    expect(ring.radius).toBe(45);
    expect(ring.circumference).toBeCloseTo(2 * Math.PI * 45);
    expect(ring.offset).toBeCloseTo(ring.circumference * 0.75);
  });

  it("TodoListApp supports add/toggle/delete in DOM", () => {
    const root = document.createElement("div");
    const app = new TodoListApp(root);

    app.input.value = "Task A";
    app.addButton.click();
    expect(root.querySelectorAll("li").length).toBe(1);
    expect(root.textContent).toContain("Task A");

    root.querySelector("[data-action='toggle']").click();
    expect(root.querySelector("span").style.textDecoration).toContain("line-through");

    root.querySelector("[data-action='delete']").click();
    expect(root.querySelectorAll("li").length).toBe(0);
  });

  it("Carousel supports button and auto-play navigation", async () => {
    const root = document.createElement("div");
    const carousel = new Carousel(root, ["A", "B", "C"]);

    expect(root.querySelector("[data-testid='track']").textContent).toBe("A");
    root.querySelector("button:nth-of-type(2)").click();
    expect(root.querySelector("[data-testid='track']").textContent).toBe("B");

    await vi.advanceTimersByTimeAsync(3000);
    expect(root.querySelector("[data-testid='track']").textContent).toBe("C");

    carousel.stop();
  });
});

