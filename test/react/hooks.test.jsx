// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  useDebounceFn,
  useDebounceValue,
  usePrevious,
  useRequest,
  useThrottleFn,
  useUpdateEffect
} from "../../src/react/hooks.js";

describe("react hooks", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("useDebounceValue updates after delay", async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounceValue(value, 100), {
      initialProps: { value: "a" }
    });

    rerender({ value: "b" });
    expect(result.current).toBe("a");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(result.current).toBe("b");
  });

  it("useDebounceFn debounces calls", async () => {
    const spy = vi.fn();
    const { result } = renderHook(() => useDebounceFn(spy, 100));

    act(() => {
      result.current("x");
      result.current("y");
    });
    expect(spy).toHaveBeenCalledTimes(0);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("y");
  });

  it("useThrottleFn triggers at most once per window", async () => {
    const spy = vi.fn();
    const { result } = renderHook(() => useThrottleFn(spy, 100));

    act(() => {
      result.current(1);
      result.current(2);
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith(2);
  });

  it("useUpdateEffect skips first render", async () => {
    const spy = vi.fn();
    const { rerender } = renderHook(({ value }) => {
      useUpdateEffect(() => {
        spy(value);
      }, [value]);
    }, {
      initialProps: { value: 1 }
    });

    expect(spy).toHaveBeenCalledTimes(0);
    rerender({ value: 2 });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(2);
  });

  it("usePrevious returns previous value", () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 }
    });
    expect(result.current).toBeUndefined();
    rerender({ value: 2 });
    expect(result.current).toBe(1);
    rerender({ value: 3 });
    expect(result.current).toBe(2);
  });

  it("useRequest supports manual run and cancel", async () => {
    const service = vi.fn(
      (value) =>
        new Promise((resolve) => {
          setTimeout(() => resolve(value * 2), 50);
        })
    );

    const { result } = renderHook(() => useRequest(service, { manual: true }));
    let promise;

    act(() => {
      promise = result.current.run(3);
    });
    expect(result.current.loading).toBe(true);

    act(() => {
      result.current.cancel();
    });
    expect(result.current.loading).toBe(false);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(50);
      await promise.catch(() => {});
    });
    expect(result.current.data).toBeUndefined();
  });
});
