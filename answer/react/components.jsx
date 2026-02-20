import React, { useMemo, useState } from "react";

export function Counter({ initial = 0 }) {
  const [count, setCount] = useState(initial);

  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => Math.max(0, c - 1));
  const reset = () => setCount(initial);

  return (
    <section>
      <p data-testid="count">{count}</p>
      <button type="button" onClick={decrement}>
        -1
      </button>
      <button type="button" onClick={increment}>
        +1
      </button>
      <button type="button" onClick={reset}>
        reset
      </button>
    </section>
  );
}

let todoId = 0;

export function TodoList() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    todoId += 1;
    setTodos((prev) => [...prev, { id: todoId, text, done: false }]);
    setInput("");
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <section>
      <input
        aria-label="todo-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="button" onClick={addTodo}>
        add
      </button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                aria-label={`toggle-${todo.id}`}
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span
                data-testid={`todo-text-${todo.id}`}
                style={{ textDecoration: todo.done ? "line-through" : "none" }}
              >
                {todo.text}
              </span>
            </label>
            <button type="button" onClick={() => deleteTodo(todo.id)}>
              delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Calculator() {
  const [num1, setNum1] = useState("0");
  const [num2, setNum2] = useState("0");
  const [operator, setOperator] = useState("+");

  const result = useMemo(() => {
    const n1 = Number.parseFloat(num1) || 0;
    const n2 = Number.parseFloat(num2) || 0;
    switch (operator) {
      case "+":
        return n1 + n2;
      case "-":
        return n1 - n2;
      case "*":
        return n1 * n2;
      case "/":
        return n2 === 0 ? "Infinity" : n1 / n2;
      default:
        return 0;
    }
  }, [num1, num2, operator]);

  return (
    <section>
      <input
        aria-label="num1"
        value={num1}
        onChange={(e) => setNum1(e.target.value)}
      />
      <select
        aria-label="operator"
        value={operator}
        onChange={(e) => setOperator(e.target.value)}
      >
        <option value="+">+</option>
        <option value="-">-</option>
        <option value="*">*</option>
        <option value="/">/</option>
      </select>
      <input
        aria-label="num2"
        value={num2}
        onChange={(e) => setNum2(e.target.value)}
      />
      <output data-testid="result">{String(result)}</output>
    </section>
  );
}
