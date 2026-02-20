// 单文件测试（Todos）: $env:HOT80_TARGET='Todos'; pnpm exec vitest run test/promise/myPromise.test.js
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function todo(name) {
  throw new Error(`TODO: ${name}`);
}

export class MyPromise {
  constructor(executor) {
    // 推导链:
    // 1) 状态机 pending -> fulfilled/rejected（不可逆）
    // 2) 保存 value 与 callbacks（pending 时 then 注册）
    // 3) executor 需要 try/catch
    // TODO: 实现构造逻辑
    void executor;
    todo("MyPromise.constructor");
  }

  then(onFulfilled, onRejected) {
    // 推导链:
    // 1) 参数透传：默认 onFulfilled(v=>v), onRejected(e=>{throw e})
    // 2) 返回新的 MyPromise 以支持链式调用
    // 3) 处理 callback 返回值：普通值 resolve，Promise 继续 then
    // 4) then 回调异步执行（setTimeout）
    // TODO: 实现 then
    void onFulfilled;
    void onRejected;
    return todo("MyPromise.then");
  }

  catch(onRejected) {
    // TODO: 复用 then(null, onRejected)
    void onRejected;
    return todo("MyPromise.catch");
  }

  static resolve(value) {
    // TODO: value 已是 MyPromise 则直接返回，否则包装为 fulfilled
    void value;
    return todo("MyPromise.resolve");
  }

  static reject(reason) {
    // TODO: 返回 rejected 的 MyPromise
    void reason;
    return todo("MyPromise.reject");
  }
}

export { PENDING, FULFILLED, REJECTED };

