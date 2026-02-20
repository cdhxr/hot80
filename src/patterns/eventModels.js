export class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback, ctx) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push({ callback, ctx });
    return this;
  }

  once(event, callback, ctx) {
    const wrapper = (...args) => {
      callback.apply(ctx, args);
      this.off(event, wrapper);
    };
    wrapper._origin = callback;
    return this.on(event, wrapper, ctx);
  }

  emit(event, ...args) {
    const listeners = this.events[event] || [];
    listeners.forEach(({ callback, ctx }) => callback.apply(ctx, args));
    return this;
  }

  off(event, callback) {
    if (!event) {
      this.events = {};
      return this;
    }

    if (!callback) {
      delete this.events[event];
      return this;
    }

    this.events[event] = (this.events[event] || []).filter(
      (item) => item.callback !== callback && item.callback._origin !== callback
    );
    return this;
  }
}

export class Subject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter((item) => item !== observer);
  }

  notify(data) {
    this.observers.forEach((observer) => observer.update(data));
  }
}

export class Observer {
  constructor(name, logger = console.log) {
    this.name = name;
    this.logger = logger;
  }

  update(data) {
    this.logger(`${this.name} received: ${data}`);
  }
}
