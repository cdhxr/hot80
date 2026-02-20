import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { Counter } from "@target/react/components.jsx";

describe("browser mode - react counter", () => {
  it("updates UI through real browser click events", () => {
    render(<Counter initial={1} />);

    const count = screen.getByTestId("count");
    fireEvent.click(screen.getByRole("button", { name: "+1" }));
    fireEvent.click(screen.getByRole("button", { name: "+1" }));

    expect(count.textContent).toBe("3");
  });
});
