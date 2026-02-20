// 单文件测试（Todos）: $env:HOT80_TARGET='Todos'; pnpm exec vitest run test/async/schedule.test.js
function todo(name) {
  throw new Error(`TODO: ${name}`);
}

export async function schedule(tasks, limit) {
  // 推导链:
  // 1) 维护 executing 池控制并发上限
  // 2) 池满时 await Promise.race(executing)
  // 3) 用 Promise.all 保证结果顺序与输入一致
  // TODO: 完成并发调度器
  return todo("schedule");
}

