// 单文件测试（Todos）: $env:HOT80_TARGET='Todos'; pnpm exec vitest run test/react/components.test.jsx
import React from "react";

function todo(name) {
  throw new Error(`TODO: ${name}`);
}

export function Counter({ initial = 0 }) {
  // 推导链:
  // 1) useState 管理 count
  // 2) +1/-1/reset 三个操作
  // 3) 最小边界防止负数（按题目要求）
  // TODO: 实现 Counter 组件
  void initial;
  return todo("Counter");
}

export function TodoList() {
  // 推导链:
  // 1) 状态: input + todos({id,text,done})
  // 2) 操作: add/toggle/delete
  // 3) 受控输入 + 列表渲染
  // TODO: 实现 TodoList 组件
  return todo("TodoList");
}

export function Calculator() {
  // 推导链:
  // 1) 状态: num1/num2/operator
  // 2) useMemo 根据 operator 计算
  // 3) 处理除零边界
  // TODO: 实现 Calculator 组件
  return todo("Calculator");
}

