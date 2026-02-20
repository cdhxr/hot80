// 单文件测试（Todos）: $env:HOT80_TARGET='Todos'; pnpm exec vitest run test/async/sleep.test.js
function todo(name) {
  throw new Error(`TODO: ${name}`);
}

export function sleep(ms) {
  // 推导链:
  // 1) Promise + setTimeout
  // TODO: 实现基础 sleep
  return todo("sleep");
}

export function sleepCancelable(ms) {
  // 推导链:
  // 1) 返回 Promise
  // 2) 把 timer id 挂到外部可访问位置
  // 3) 提供 cancel() 清除定时器
  // TODO: 实现可取消 sleep
  return todo("sleepCancelable");
}

