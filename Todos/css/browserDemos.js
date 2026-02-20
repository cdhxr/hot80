// 单文件测试（Todos）: $env:HOT80_TARGET='Todos'; pnpm exec vitest run test/css/browserDemos.test.js
function todo(name) {
  throw new Error(`TODO: ${name}`);
}

export function createTriangleStyle(size = 10, color = "red") {
  // 推导链:
  // 1) 宽高为 0
  // 2) 左右边框透明
  // 3) 下边框设颜色形成三角形
  // TODO: 返回三角形样式对象
  return todo("createTriangleStyle");
}

export function createProgressRingState(progress = 0, size = 100, strokeWidth = 10) {
  // 推导链:
  // 1) radius = (size - strokeWidth) / 2
  // 2) circumference = 2 * PI * radius
  // 3) offset 按进度换算（并先 clamp 进度）
  // TODO: 返回 { radius, circumference, offset }
  return todo("createProgressRingState");
}

export class TodoListApp {
  constructor(root) {
    // 推导链:
    // 1) 初始化状态和基础 DOM 节点
    // 2) 绑定添加、切换、删除事件
    // 3) 首次挂载到 root
    // TODO: 完成初始化
    void root;
    todo("TodoListApp.constructor");
  }

  addTodo(text = this.input?.value?.trim()) {
    // 推导链:
    // 1) 空文本直接返回
    // 2) push 新 todo，清空输入框
    // 3) 触发 render
    // TODO: 实现 addTodo
    void text;
    return todo("TodoListApp.addTodo");
  }

  toggleTodo(id) {
    // 推导链:
    // 1) map 找到对应 id 翻转 done
    // 2) render
    // TODO: 实现 toggleTodo
    void id;
    return todo("TodoListApp.toggleTodo");
  }

  deleteTodo(id) {
    // 推导链:
    // 1) filter 删除目标 id
    // 2) render
    // TODO: 实现 deleteTodo
    void id;
    return todo("TodoListApp.deleteTodo");
  }

  render() {
    // 推导链:
    // 1) 根据 todos 生成 li 列表
    // 2) 用 done 状态控制文本样式
    // TODO: 实现 render
    return todo("TodoListApp.render");
  }
}

export class Carousel {
  constructor(container, slides = []) {
    // 推导链:
    // 1) 初始化 current/timer/slides
    // 2) 创建 track + prev/next + indicators
    // 3) 绑定事件后 render + start
    // TODO: 实现构造函数
    void container;
    void slides;
    todo("Carousel.constructor");
  }

  render() {
    // 推导链:
    // 1) track 显示 current slide
    // 2) 渲染指示器并绑定 goTo
    // TODO: 实现 render
    return todo("Carousel.render");
  }

  goTo(index) {
    // 推导链:
    // 1) index 做环形归一化
    // 2) 更新 current 并 render
    // TODO: 实现 goTo
    void index;
    return todo("Carousel.goTo");
  }

  next() {
    // TODO: 调用 goTo(this.current + 1)
    return todo("Carousel.next");
  }

  prev() {
    // TODO: 调用 goTo(this.current - 1)
    return todo("Carousel.prev");
  }

  start(interval = 3000) {
    // 推导链:
    // 1) 先 stop 防重入
    // 2) setInterval 周期调用 next
    // TODO: 实现自动播放
    void interval;
    return todo("Carousel.start");
  }

  stop() {
    // TODO: clearInterval(timer) 并重置 timer
    return todo("Carousel.stop");
  }
}

