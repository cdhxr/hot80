import { describe, expect, it } from "vitest";

describe("browser mode - real layout", () => {
  it("measures width using browser layout engine", () => {
    const box = document.createElement("div");
    box.style.width = "120px";
    box.style.height = "20px";
    box.style.border = "0";
    box.style.padding = "0";
    box.style.margin = "0";
    document.body.appendChild(box);

    const width = box.getBoundingClientRect().width;
    expect(width).toBeGreaterThan(0);
    expect(Math.round(width)).toBe(120);
  });
});
