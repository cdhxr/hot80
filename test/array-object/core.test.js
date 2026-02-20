import { describe, expect, it, vi } from "vitest";
import {
  deepClone,
  deepEqual,
  flat,
  flattenObj,
  get,
  getType,
  myFilter,
  myMap,
  myReduce,
  omit,
  pick,
  reactiveArray,
  set,
  uniqueBasic,
  uniqueBy
} from "@target/array-object/core.js";

describe("array-object core", () => {
  it("deepClone creates independent nested object", () => {
    const source = {
      a: 1,
      b: { c: 2 },
      d: new Date("2024-01-01"),
      e: /abc/g,
      m: new Map([["x", { y: 1 }]]),
      s: new Set([1, 2, 3])
    };
    source.self = source;

    const cloned = deepClone(source);
    cloned.b.c = 99;
    cloned.m.get("x").y = 100;

    expect(cloned).not.toBe(source);
    expect(source.b.c).toBe(2);
    expect(source.m.get("x").y).toBe(1);
    expect(cloned.self).toBe(cloned);
  });

  it("deepEqual compares nested values", () => {
    expect(deepEqual({ a: [1, 2] }, { a: [1, 2] })).toBe(true);
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  it("get/set supports dot and bracket path", () => {
    const obj = {};
    set(obj, "a.b[0].c", 42);
    expect(obj).toEqual({ a: { b: [{ c: 42 }] } });
    expect(get(obj, "a.b[0].c")).toBe(42);
    expect(get(obj, "a.x", "default")).toBe("default");
  });

  it("getType returns precise lower-case type", () => {
    expect(getType([])).toBe("array");
    expect(getType(new Map())).toBe("map");
    expect(getType(null)).toBe("null");
  });

  it("flat supports depth", () => {
    const input = [1, [2, [3, 4]]];
    expect(flat(input, 1)).toEqual([1, 2, [3, 4]]);
    expect(flat(input, 2)).toEqual([1, 2, 3, 4]);
  });

  it("flattenObj flattens nested object and arrays", () => {
    const input = { a: { b: 1 }, c: [2, { d: 3 }] };
    expect(flattenObj(input)).toEqual({
      "a.b": 1,
      "c[0]": 2,
      "c[1].d": 3
    });
  });

  it("unique helpers remove duplicates", () => {
    expect(uniqueBasic([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
    expect(
      uniqueBy(
        [
          { id: 1, n: "A" },
          { id: 1, n: "B" },
          { id: 2, n: "C" }
        ],
        "id"
      )
    ).toEqual([
      { id: 1, n: "A" },
      { id: 2, n: "C" }
    ]);
  });

  it("myMap/myFilter/myReduce behave like array methods", () => {
    expect(myMap([1, 2, 3], (x) => x * 2)).toEqual([2, 4, 6]);
    expect(myFilter([1, 2, 3], (x) => x > 1)).toEqual([2, 3]);
    expect(myReduce([1, 2, 3], (a, b) => a + b, 0)).toBe(6);
  });

  it("pick/omit selects keys", () => {
    const user = { id: 1, name: "张三", email: "a@b.com", password: "x" };
    expect(pick(user, ["id", "name"])).toEqual({ id: 1, name: "张三" });
    expect(omit(user, ["password"])).toEqual({
      id: 1,
      name: "张三",
      email: "a@b.com"
    });
  });

  it("reactiveArray emits method/set/delete change events", () => {
    const onChange = vi.fn();
    const arr = reactiveArray([1, 2], onChange);
    arr.push(3);
    arr[0] = 9;
    delete arr[1];

    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange.mock.calls[0][0].type).toBe("method");
    expect(onChange.mock.calls[1][0]).toMatchObject({
      type: "set",
      key: "0",
      oldValue: 1,
      newValue: 9
    });
    expect(onChange.mock.calls[2][0]).toMatchObject({
      type: "delete",
      key: "1",
      oldValue: 2
    });
  });
});

