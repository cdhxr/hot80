import { describe, expect, it, vi } from "vitest";
import {
  EventEmitter,
  Observer,
  Subject
} from "../../src/patterns/eventModels.js";

describe("EventEmitter", () => {
  it("supports on and emit", () => {
    const emitter = new EventEmitter();
    const received = [];
    emitter.on("data", (value) => received.push(value));

    emitter.emit("data", "hello");
    expect(received).toEqual(["hello"]);
  });

  it("supports once", () => {
    const emitter = new EventEmitter();
    const callback = vi.fn();

    emitter.once("data", callback);
    emitter.emit("data", 1);
    emitter.emit("data", 2);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(1);
  });

  it("supports off by callback/event/all", () => {
    const emitter = new EventEmitter();
    const a = vi.fn();
    const b = vi.fn();

    emitter.on("evt", a);
    emitter.on("evt", b);
    emitter.off("evt", a);
    emitter.emit("evt");
    expect(a).toHaveBeenCalledTimes(0);
    expect(b).toHaveBeenCalledTimes(1);

    emitter.off("evt");
    emitter.emit("evt");
    expect(b).toHaveBeenCalledTimes(1);

    emitter.on("x", a);
    emitter.off();
    emitter.emit("x");
    expect(a).toHaveBeenCalledTimes(0);
  });
});

describe("Subject/Observer", () => {
  it("notifies subscribed observers", () => {
    const logs = [];
    const subject = new Subject();
    const a = new Observer("A", (msg) => logs.push(msg));
    const b = new Observer("B", (msg) => logs.push(msg));

    subject.subscribe(a);
    subject.subscribe(b);
    subject.notify("Update!");

    expect(logs).toEqual(["A received: Update!", "B received: Update!"]);
  });

  it("supports unsubscribe", () => {
    const observer = { update: vi.fn() };
    const subject = new Subject();
    subject.subscribe(observer);
    subject.unsubscribe(observer);
    subject.notify("x");
    expect(observer.update).toHaveBeenCalledTimes(0);
  });
});
