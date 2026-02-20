// 单文件测试（Todos）: $env:HOT80_TARGET='Todos'; pnpm exec vitest run test/react/hooks.test.jsx
import { useCallback, useEffect, useRef, useState } from "react";

function todo(name) {
  throw new Error(`TODO: ${name}`);
}

export function useDebounceValue(value, delay) {
  // 推导链:
  // 1) state 保存 debounced 值
  // 2) useEffect + setTimeout 延迟更新
  // 3) cleanup 清理旧 timer
  // TODO: 实现 useDebounceValue
  void value;
  void delay;
  return todo("useDebounceValue");
}

export function useDebounceFn(fn, delay, options = {}) {
  // 推导链:
  // 1) useRef 持有 timer 和最新 fn
  // 2) trailing/leading 行为控制
  // 3) 返回稳定的 useCallback
  // TODO: 实现 useDebounceFn
  void fn;
  void delay;
  void options;
  return todo("useDebounceFn");
}

export function useThrottleFn(fn, delay, options = {}) {
  // 推导链:
  // 1) lastTimeRef 记录上次执行时间
  // 2) remain<=0 立即执行，否则按 trailing 补一次
  // TODO: 实现 useThrottleFn
  void fn;
  void delay;
  void options;
  return todo("useThrottleFn");
}

export function useUpdateEffect(effect, deps = []) {
  // 推导链:
  // 1) useRef 标记首次渲染
  // 2) 首次跳过，后续按 deps 执行
  // TODO: 实现 useUpdateEffect
  void effect;
  void deps;
  return todo("useUpdateEffect");
}

export function usePrevious(value, initialValue) {
  // 推导链:
  // 1) useRef 保存上一次值
  // 2) effect 在渲染后更新 ref.current
  // TODO: 实现 usePrevious
  void value;
  void initialValue;
  return todo("usePrevious");
}

export function useRequest(serviceFn, options = {}) {
  // 推导链:
  // 1) 维护 data/error/loading 三态
  // 2) 提供 run/refresh/cancel
  // 3) 支持 manual、debounce、polling 等选项
  // TODO: 实现 useRequest
  void serviceFn;
  void options;
  return todo("useRequest");
}

