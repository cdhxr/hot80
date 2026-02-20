function todo(name) {
  throw new Error(`TODO: ${name}`);
}

function noop() {}

export function codingMan(name, logger = console.log, scheduler = setTimeout) {
  // 推导链:
  // 1) 维护任务队列，方法链都 return this
  // 2) eat/sleep/sleepFirst 分别 push/unshift 任务
  // 3) 用 scheduler(..., 0) 延迟启动 next，确保链式注册完成
  // TODO: 实现 CodingMan（next 驱动版）
  void name;
  void logger;
  void scheduler;
  return todo("codingMan");
}

export function codingManV2(name, logger = console.log, scheduler = setTimeout) {
  // 推导链:
  // 1) 队列存 task 函数
  // 2) sleep/sleepFirst 返回 Promise 任务
  // 3) 延迟后 for..of + await 串行执行
  // TODO: 实现 CodingMan（for-await 版）
  void name;
  void logger;
  void scheduler;
  return todo("codingManV2");
}

export { noop };
