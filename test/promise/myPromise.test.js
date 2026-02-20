import { describe, expect, it } from "vitest";
import { MyPromise } from "../../src/promise/MyPromise.js";

describe("MyPromise", () => {
  it("supports async resolve and chain", async () => {
    const result = await new MyPromise((resolve) => {
      setTimeout(() => resolve(1), 10);
    })
      .then((v) => v + 1)
      .then((v) => new MyPromise((resolve) => setTimeout(() => resolve(v + 1), 10)));

    expect(result).toBe(3);
  });

  it("supports catch", async () => {
    const result = await new MyPromise((_, reject) => reject(new Error("boom"))).catch(
      (error) => error.message
    );

    expect(result).toBe("boom");
  });

  it("passes through value when onFulfilled is missing", async () => {
    const result = await MyPromise.resolve(5).then().then((v) => v);
    expect(result).toBe(5);
  });

  it("throws through reason when onRejected is missing", async () => {
    const promise = MyPromise.reject(new Error("failed")).then();
    await expect(promise).rejects.toThrow("failed");
  });
});
