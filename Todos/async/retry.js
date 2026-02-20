// 单文件测试（Todos）: $env:HOT80_TARGET='Todos'; pnpm exec vitest run test/async/retry.test.js
function todo(name) {
  throw new Error(`TODO: ${name}`);
}

export function requestWithRetry(
  fn,
  { retries = 3, timeout = 5000, delay = 1000 } = {}
) {
  // 推导链:
  // 1) 每次请求都包一层 timeout Promise（race）
  // 2) 失败后判断剩余重试次数，必要时 delay 后重试
  // 3) 成功 resolve，重试耗尽 reject
  // TODO: 完成重试 + 超时控制
  return todo("requestWithRetry");
}

