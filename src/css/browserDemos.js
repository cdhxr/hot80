export function createTriangleStyle(size = 10, color = "red") {
  return {
    width: "0",
    height: "0",
    borderLeft: `${size}px solid transparent`,
    borderRight: `${size}px solid transparent`,
    borderBottom: `${size * 2}px solid ${color}`
  };
}

export function createProgressRingState(progress = 0, size = 100, strokeWidth = 10) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, progress));
  const offset = circumference - (clamped / 100) * circumference;
  return { radius, circumference, offset };
}

export class TodoListApp {
  constructor(root) {
    this.root = root;
    this.todos = [];
    this.id = 0;
    this.input = root.ownerDocument.createElement("input");
    this.input.setAttribute("aria-label", "todo-input");
    this.addButton = root.ownerDocument.createElement("button");
    this.addButton.textContent = "Add";
    this.list = root.ownerDocument.createElement("ul");

    this.addButton.addEventListener("click", () => this.addTodo());
    this.list.addEventListener("click", (event) => {
      const target = event.target;
      const li = target.closest("li");
      if (!li) return;
      const id = Number(li.dataset.id);
      if (target.matches("[data-action='toggle']")) this.toggleTodo(id);
      if (target.matches("[data-action='delete']")) this.deleteTodo(id);
    });

    root.append(this.input, this.addButton, this.list);
  }

  addTodo(text = this.input.value.trim()) {
    if (!text) return;
    this.id += 1;
    this.todos.push({ id: this.id, text, done: false });
    this.input.value = "";
    this.render();
  }

  toggleTodo(id) {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    );
    this.render();
  }

  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.render();
  }

  render() {
    this.list.innerHTML = this.todos
      .map(
        (todo) => `
      <li data-id="${todo.id}">
        <button data-action="toggle">${todo.done ? "Undo" : "Done"}</button>
        <span style="text-decoration:${todo.done ? "line-through" : "none"}">${todo.text}</span>
        <button data-action="delete">Delete</button>
      </li>
    `
      )
      .join("");
  }
}

export class Carousel {
  constructor(container, slides = []) {
    this.container = container;
    this.slides = slides;
    this.current = 0;
    this.timer = null;

    this.track = container.ownerDocument.createElement("div");
    this.track.setAttribute("data-testid", "track");
    this.indicators = container.ownerDocument.createElement("div");

    this.prevBtn = container.ownerDocument.createElement("button");
    this.prevBtn.textContent = "Prev";
    this.nextBtn = container.ownerDocument.createElement("button");
    this.nextBtn.textContent = "Next";

    this.prevBtn.addEventListener("click", () => this.prev());
    this.nextBtn.addEventListener("click", () => this.next());

    this.container.append(this.track, this.prevBtn, this.nextBtn, this.indicators);
    this.render();
    this.start();
  }

  render() {
    this.track.textContent = this.slides[this.current] ?? "";
    this.indicators.innerHTML = this.slides
      .map(
        (_, index) =>
          `<button data-index="${index}" aria-current="${
            index === this.current ? "true" : "false"
          }">${index + 1}</button>`
      )
      .join("");
    this.indicators.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        this.goTo(Number(button.dataset.index));
      });
    });
  }

  goTo(index) {
    this.current = (index + this.slides.length) % this.slides.length;
    this.render();
  }

  next() {
    this.goTo(this.current + 1);
  }

  prev() {
    this.goTo(this.current - 1);
  }

  start(interval = 3000) {
    this.stop();
    this.timer = setInterval(() => this.next(), interval);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}
