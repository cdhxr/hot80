function todo(name) {
  throw new Error(`TODO: ${name}`);
}

export class EventEmitter {
  constructor() {
    // 推导链:
    // 1) 事件中心结构: { eventName: [{ callback, ctx }] }
    // TODO: 初始化 events
    todo("EventEmitter.constructor");
  }

  on(event, callback, ctx) {
    // 推导链:
    // 1) 初始化事件数组
    // 2) 保存订阅者并支持链式调用
    // TODO: 实现 on
    void event;
    void callback;
    void ctx;
    return todo("EventEmitter.on");
  }

  once(event, callback, ctx) {
    // 推导链:
    // 1) 包装回调，执行后自动 off
    // 2) 包装函数上保留原始回调用于匹配删除
    // TODO: 实现 once
    void event;
    void callback;
    void ctx;
    return todo("EventEmitter.once");
  }

  emit(event, ...args) {
    // 推导链:
    // 1) 找到当前事件的所有订阅者
    // 2) 逐个 apply 执行
    // TODO: 实现 emit
    void event;
    void args;
    return todo("EventEmitter.emit");
  }

  off(event, callback) {
    // 推导链:
    // 1) 无参数: 清空所有事件
    // 2) 仅 event: 清空该事件
    // 3) event+callback: 移除指定回调/一次性包装回调
    // TODO: 实现 off
    void event;
    void callback;
    return todo("EventEmitter.off");
  }
}

export class Subject {
  constructor() {
    // 推导链: observers 数组维护观察者列表
    // TODO: 初始化 observers
    todo("Subject.constructor");
  }

  subscribe(observer) {
    // TODO: 添加观察者
    void observer;
    return todo("Subject.subscribe");
  }

  unsubscribe(observer) {
    // TODO: 移除观察者
    void observer;
    return todo("Subject.unsubscribe");
  }

  notify(data) {
    // TODO: 通知所有观察者执行 update(data)
    void data;
    return todo("Subject.notify");
  }
}

export class Observer {
  constructor(name, logger = console.log) {
    this.name = name;
    this.logger = logger;
  }

  update(data) {
    // TODO: 输出 `${name} received: ${data}`
    void data;
    return todo("Observer.update");
  }
}
