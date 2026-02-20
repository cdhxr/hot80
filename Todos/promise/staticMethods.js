// 单文件测试（Todos）: $env:HOT80_TARGET='Todos'; pnpm exec vitest run test/promise/staticMethods.test.js
function todo(name) {
  throw new Error(`TODO: ${name}`);
}

export function myAll(promises) {
  // 推导链:
  // 1) 全部成功才 resolve
  // 2) 任何一个 reject 立即 reject
  // 3) 结果顺序按输入索引保存
  // TODO: 实现 Promise.all
  void promises;
  return todo("myAll");
}

export function myRace(promises) {
  // 推导链:
  // 1) 谁先 settle（成功或失败）就采用谁
  // TODO: 实现 Promise.race
  void promises;
  return todo("myRace");
}

export function myAllSettled(promises) {
  // 推导链:
  // 1) 等全部完成
  // 2) 每项输出 { status, value|reason }
  // TODO: 实现 Promise.allSettled
  void promises;
  return todo("myAllSettled");
}

export function myAny(promises) {
  // 推导链:
  // 1) 第一个 fulfilled 就 resolve
  // 2) 全部 rejected 才 reject AggregateError
  // TODO: 实现 Promise.any
  void promises;
  return todo("myAny");
}

