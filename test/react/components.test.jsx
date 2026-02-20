// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { Calculator, Counter, TodoList } from "../../src/react/components.jsx";

describe("react components", () => {
  it("Counter increments/decrements/resets", () => {
    render(<Counter initial={1} />);
    const count = screen.getByTestId("count");

    fireEvent.click(screen.getByRole("button", { name: "+1" }));
    fireEvent.click(screen.getByRole("button", { name: "+1" }));
    expect(count.textContent).toBe("3");

    fireEvent.click(screen.getByRole("button", { name: "-1" }));
    expect(count.textContent).toBe("2");

    fireEvent.click(screen.getByRole("button", { name: "reset" }));
    expect(count.textContent).toBe("1");
  });

  it("TodoList adds/toggles/deletes todo", () => {
    render(<TodoList />);

    fireEvent.change(screen.getByLabelText("todo-input"), {
      target: { value: "Learn Vitest" }
    });
    fireEvent.click(screen.getByRole("button", { name: "add" }));

    const itemText = screen.getByText("Learn Vitest");
    expect(itemText).toBeTruthy();

    fireEvent.click(screen.getByRole("checkbox"));
    expect(itemText.style.textDecoration).toContain("line-through");

    fireEvent.click(screen.getByRole("button", { name: "delete" }));
    expect(screen.queryByText("Learn Vitest")).toBeNull();
  });

  it("Calculator computes selected operation", () => {
    render(<Calculator />);

    fireEvent.change(screen.getByLabelText("num1"), { target: { value: "10" } });
    fireEvent.change(screen.getByLabelText("operator"), { target: { value: "*" } });
    fireEvent.change(screen.getByLabelText("num2"), { target: { value: "5" } });

    expect(screen.getByTestId("result").textContent).toBe("50");
  });
});
