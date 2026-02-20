const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

export class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.callbacks = [];

    const resolve = (value) => {
      if (this.state !== PENDING) return;
      this.state = FULFILLED;
      this.value = value;
      this.callbacks.forEach((cb) => cb.onFulfilled(value));
    };

    const reject = (reason) => {
      if (this.state !== PENDING) return;
      this.state = REJECTED;
      this.value = reason;
      this.callbacks.forEach((cb) => cb.onRejected(reason));
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    const fulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    const rejected =
      typeof onRejected === "function"
        ? onRejected
        : (e) => {
            throw e;
          };

    return new MyPromise((resolve, reject) => {
      const handle = (callback) => {
        try {
          const result = callback(this.value);
          result instanceof MyPromise
            ? result.then(resolve, reject)
            : resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      if (this.state === FULFILLED) {
        setTimeout(() => handle(fulfilled));
        return;
      }

      if (this.state === REJECTED) {
        setTimeout(() => handle(rejected));
        return;
      }

      this.callbacks.push({
        onFulfilled: () => setTimeout(() => handle(fulfilled)),
        onRejected: () => setTimeout(() => handle(rejected))
      });
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  static resolve(value) {
    return value instanceof MyPromise ? value : new MyPromise((r) => r(value));
  }

  static reject(reason) {
    return new MyPromise((_, r) => r(reason));
  }
}

export { PENDING, FULFILLED, REJECTED };
