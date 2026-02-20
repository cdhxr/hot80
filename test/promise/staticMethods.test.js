import { describe, expect, it } from "vitest";
import {
  myAll,
  myAllSettled,
  myAny,
  myRace
} from "@target/promise/staticMethods.js";

describe("promise static methods", () => {
  it("myAll resolves in input order", async () => {
    const result = await myAll([
      Promise.resolve(1),
      new Promise((resolve) => setTimeout(() => resolve(2), 10)),
      3
    ]);
    expect(result).toEqual([1, 2, 3]);
  });

  it("myAll rejects when one rejects", async () => {
    await expect(myAll([Promise.resolve(1), Promise.reject("err")])).rejects.toBe("err");
  });

  it("myRace settles with the first settled promise", async () => {
    const result = await myRace([
      new Promise((resolve) => setTimeout(() => resolve("slow"), 20)),
      new Promise((resolve) => setTimeout(() => resolve("fast"), 10))
    ]);
    expect(result).toBe("fast");
  });

  it("myAllSettled waits for all and returns status objects", async () => {
    const result = await myAllSettled([Promise.resolve(1), Promise.reject("err")]);
    expect(result).toEqual([
      { status: "fulfilled", value: 1 },
      { status: "rejected", reason: "err" }
    ]);
  });

  it("myAny resolves with first fulfilled value", async () => {
    const result = await myAny([
      Promise.reject("err1"),
      Promise.resolve("success"),
      Promise.reject("err2")
    ]);
    expect(result).toBe("success");
  });

  it("myAny rejects with AggregateError when all fail", async () => {
    await expect(myAny([Promise.reject("a"), Promise.reject("b")])).rejects.toThrow(
      "All promises were rejected"
    );
  });
});

