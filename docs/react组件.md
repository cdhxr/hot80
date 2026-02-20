# ⚛️ React 组件推导链笔记（12 题）

> 高频 React 组件的推导思路 + 变体速查 + 代码实现

---

## 1️⃣ Counter 计数器

### 🔗 推导链
```
Q1: 需求是什么？
→ 加、减、清空 + input 联动 + 不能为负数

Q2: 核心是什么？
→ 受控组件：value 绑定 state，onChange 更新 state

Q3: 边界怎么处理？
→ Math.max(0, val) 防负数
→ || 0 防 NaN
```

### 💻 代码
```jsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => Math.max(0, c - 1));
  const reset = () => setCount(0);
  
  const handleChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    setCount(Math.max(0, val));
  };

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button onClick={decrement}>-</button>
      <input 
        type="number" 
        value={count} 
        onChange={handleChange}
        style={{ width: 60, textAlign: 'center' }}
      />
      <button onClick={increment}>+</button>
      <button onClick={reset}>清空</button>
    </div>
  );
}
```

---

## 2️⃣ TodoList 待办事项

### 🔗 推导链
```
Q1: 需求？
→ 增删改查 + 完成状态切换

Q2: 数据结构？
→ { id, text, completed }[]

Q3: 核心操作？
→ 增：push 新项（用 Date.now() 或 uuid 生成 id）
→ 删：filter 过滤
→ 改：map 找到对应 id 修改
→ 切换：map 翻转 completed
```

### 💻 代码
```jsx
import { useState } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, {
      id: Date.now(),
      text: input.trim(),
      completed: false
    }]);
    setInput('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id, newText) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && addTodo()}
          placeholder="输入待办事项..."
        />
        <button onClick={addTodo}>添加</button>
      </div>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ 
            display: 'flex', 
            gap: 8, 
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: '1px solid #eee'
          }}>
            <input 
              type="checkbox" 
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ 
              textDecoration: todo.completed ? 'line-through' : 'none',
              flex: 1 
            }}>
              {todo.text}
            </span>
            <button onClick={() => {
              const newText = prompt('编辑', todo.text);
              if (newText !== null) editTodo(todo.id, newText);
            }}>编辑</button>
            <button onClick={() => deleteTodo(todo.id)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 3️⃣ CountDown 倒计时

### 🔗 推导链
```
Q1: 需求？
→ 显示剩余时间，每秒更新，到 0 停止

Q2: 核心？
→ useEffect + setInterval
→ 清理：return clearInterval

Q3: 注意点？
→ 依赖数组要包含 count，或用函数式更新
→ count <= 0 时 clearInterval
```

### 💻 代码
```jsx
import { useState, useEffect, useRef } from 'react';

export default function CountDown({ initialSeconds, onEnd }) {
  const [count, setCount] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (running && count > 0) {
      timerRef.current = setInterval(() => {
        setCount(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setRunning(false);
            onEnd?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [running, count, onEnd]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 32, fontFamily: 'monospace', marginBottom: 16 }}>
        {formatTime(count)}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {!running ? (
          <button onClick={() => setRunning(true)}>开始</button>
        ) : (
          <button onClick={() => {
            setRunning(false);
            timerRef.current && clearInterval(timerRef.current);
          }}>暂停</button>
        )}
        <button onClick={() => {
          setRunning(false);
          setCount(initialSeconds);
          timerRef.current && clearInterval(timerRef.current);
        }}>重置</button>
      </div>
    </div>
  );
}
```

---

## 4️⃣ Calculator 简易计算器

### 🔗 推导链
```
Q1: 需求？
→ 两个数输入 + 运算符选择 + 显示结果

Q2: 状态？
→ num1, num2, operator, result

Q3: 计算逻辑？
→ switch 根据 operator 计算
→ 除法注意除零
```

### 💻 代码
```jsx
import { useState, useMemo } from 'react';

export default function Calculator() {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [operator, setOperator] = useState('+');

  const result = useMemo(() => {
    const n1 = parseFloat(num1) || 0;
    const n2 = parseFloat(num2) || 0;
    
    switch (operator) {
      case '+': return n1 + n2;
      case '-': return n1 - n2;
      case '*': return n1 * n2;
      case '/': return n2 === 0 ? 'Error' : n1 / n2;
      default: return 0;
    }
  }, [num1, num2, operator]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 300 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input 
          type="number" 
          value={num1}
          onChange={e => setNum1(e.target.value)}
          placeholder="数字1"
          style={{ flex: 1 }}
        />
        <select value={operator} onChange={e => setOperator(e.target.value)}>
          <option value="+">+</option>
          <option value="-">−</option>
          <option value="*">×</option>
          <option value="/">÷</option>
        </select>
        <input 
          type="number" 
          value={num2}
          onChange={e => setNum2(e.target.value)}
          placeholder="数字2"
          style={{ flex: 1 }}
        />
      </div>
      
      <div style={{ 
        padding: 16, 
        background: '#f5f5f5', 
        borderRadius: 4,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold'
      }}>
        = {result}
      </div>
    </div>
  );
}
```

---

## 5️⃣ CascadeSelect 级联选择

### 🔗 推导链
```
Q1: 需求？
→ 省市区三级联动，选择上级后加载下级

Q2: 核心？
→ 每级一个 state
→ 选择变化时清空下级 + 加载新数据

Q3: 数据结构？
→ { value, label, children? }[]
```

### 💻 代码
```jsx
import { useState, useMemo } from 'react';

// 模拟数据
const areaData = [
  {
    value: 'zj', label: '浙江',
    children: [
      { value: 'hz', label: '杭州', children: [
        { value: 'xh', label: '西湖区' },
        { value: 'ys', label: '余杭区' }
      ]},
      { value: 'nb', label: '宁波', children: [
        { value: 'yz', label: '鄞州区' }
      ]}
    ]
  },
  {
    value: 'js', label: '江苏',
    children: [
      { value: 'nj', label: '南京', children: [
        { value: 'xw', label: '玄武区' }
      ]}
    ]
  }
];

export default function CascadeSelect({ data = areaData, onChange }) {
  const [selection, setSelection] = useState([null, null, null]);

  // 获取某级的可选项
  const getOptions = (level, parentValue) => {
    if (level === 0) return data;
    if (level === 1) {
      const parent = data.find(d => d.value === selection[0]);
      return parent?.children || [];
    }
    if (level === 2) {
      const parent = data.find(d => d.value === selection[0])?.children
        .find(c => c.value === selection[1]);
      return parent?.children || [];
    }
    return [];
  };

  const handleChange = (level, value) => {
    const newSelection = [...selection];
    newSelection[level] = value;
    
    // 清空下级选择
    for (let i = level + 1; i < 3; i++) {
      newSelection[i] = null;
    }
    
    setSelection(newSelection);
    onChange?.(newSelection.filter(v => v !== null));
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {[0, 1, 2].map(level => {
        const options = getOptions(level, selection[level - 1]);
        const value = selection[level];
        
        return (
          <select 
            key={level}
            value={value || ''}
            onChange={e => handleChange(level, e.target.value)}
            disabled={level > 0 && !selection[level - 1]}
          >
            <option value="">请选择</option>
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      })}
    </div>
  );
}
```

---

## 6️⃣ LazyImage 图片懒加载

### 🔗 推导链
```
Q1: 需求？
→ 图片进入视口才加载

Q2: 核心？
→ IntersectionObserver 监听元素是否可见
→ 可见时设置 src

Q3: 清理？
→ useEffect return 里 disconnect
```

### 💻 代码
```jsx
import { useState, useEffect, useRef } from 'react';

export default function LazyImage({ src, alt, placeholder, ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // 开始加载图片
          const img = new Image();
          img.src = src;
          img.onload = () => setLoaded(true);
          img.onerror = () => setError(true);
          
          // 停止观察
          observer.disconnect();
        }
      },
      { rootMargin: '50px' } // 提前 50px 开始加载
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <div ref={imgRef} style={{ position: 'relative', ...props.style }}>
      {!loaded && !error && (
        <div style={{ 
          width: '100%', 
          height: '100%', 
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {placeholder || 'Loading...'}
        </div>
      )}
      
      {error && <div style={{ color: '#f44336' }}>加载失败</div>}
      
      <img
        src={loaded ? src : ''}
        alt={alt}
        style={{ 
          width: '100%', 
          height: '100%',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s',
          position: loaded ? 'relative' : 'absolute'
        }}
        {...props}
      />
    </div>
  );
}

// 使用示例
// <LazyImage 
//   src="https://example.com/image.jpg" 
//   alt="示例图片"
//   placeholder={<Spinner />}
//   style={{ width: 300, height: 200 }}
// />
```

---

## 7️⃣ 虚拟列表 VirtualList

### 🔗 推导链
```
Q1: 为什么需要？
→ 大量数据渲染卡顿，只渲染可见区域

Q2: 核心计算？
→ startIndex = scrollTop / itemHeight
→ endIndex = startIndex + visibleCount
→ 用 paddingTop 撑开滚动高度

Q3: 定高 vs 不定高？
→ 定高：直接计算
→ 不定高：预估高度 + 渲染后测量修正
```

### 📊 变体速查

| 形态 | 核心 | 适用场景 |
|------|------|----------|
| 定高版 | `itemHeight` 固定，直接计算 | 列表项高度一致 |
| 不定高版 | 预估高度 + `positions` 数组记录实际位置 | 高度动态变化 |

### 💻 代码（定高版）
```jsx
import { useState, useMemo, useRef, useEffect } from 'react';

export default function VirtualList({ 
  items, 
  itemHeight = 50, 
  containerHeight = 500,
  renderItem 
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  // 可见区域计算
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);
  
  // 可见数据
  const visibleItems = useMemo(() => 
    items.slice(startIndex, endIndex).map((item, idx) => ({
      data: item,
      index: startIndex + idx
    })), 
    [items, startIndex, endIndex]
  );

  // 滚动处理
  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      style={{ 
        height: containerHeight, 
        overflow: 'auto',
        position: 'relative'
      }}
    >
      {/* 撑开滚动区域 */}
      <div style={{ height: items.length * itemHeight }} />
      
      {/* 可见区域内容 */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0,
        paddingTop: startIndex * itemHeight 
      }}>
        {visibleItems.map(({ data, index }) => (
          <div 
            key={index} 
            style={{ height: itemHeight, display: 'flex', alignItems: 'center' }}
          >
            {renderItem?.(data, index) || JSON.stringify(data)}
          </div>
        ))}
      </div>
    </div>
  );
}

// 使用示例
// <VirtualList
//   items={Array.from({ length: 10000 }, (_, i) => ({ id: i, text: `Item ${i}` }))}
//   itemHeight={50}
//   renderItem={(item) => <div>{item.text}</div>}
// />
```

---

## 8️⃣ LoggerDebug 闭包陷阱修复

### 🔗 推导链
```
Q1: 核心问题？
→ useEffect [] 依赖为空，回调里的 state 是 mount 时的快照

Q2: 问题清单？

| 问题代码 | 问题 | 解决方案 |
|---------|------|----------|
| `setLogs([...logs, log])` | 闭包，logs=[] | `setLogs(prev => [...prev, log])` |
| `console.log(logs.length)` | 闭包，永远是0 | useRef 存最新值 |
| `event.on(...)` | 内存泄漏 | return 里 event.off |
| `timer = setTimeout` | 未声明+泄漏 | const timer + clearTimeout |
| `logs.map(...)` | 缺少key | 用唯一ID作为key |
```

### 💻 代码（修复版）
```jsx
import { useState, useEffect, useRef } from 'react';

export default function LoggerDebug() {
  const [logs, setLogs] = useState([]);
  const logsRef = useRef([]);  // ✅ 用 ref 保存最新值
  const timerRef = useRef(null);

  // ✅ 同步 ref 和 state
  useEffect(() => {
    logsRef.current = logs;
  }, [logs]);

  useEffect(() => {
    const event = new EventTarget();
    
    // ✅ 使用函数式更新，避免闭包
    const handleLog = (log) => {
      setLogs(prev => [...prev, { id: Date.now(), ...log }]);
    };

    event.addEventListener('log', (e) => handleLog(e.detail));

    // ✅ 定时器用 ref 保存，方便清理
    timerRef.current = setInterval(() => {
      // ✅ 通过 ref 访问最新值
      console.log('当前日志数:', logsRef.current.length);
      event.dispatchEvent(new CustomEvent('log', { 
        detail: { message: 'Auto log', time: new Date() } 
      }));
    }, 2000);

    // ✅ 清理函数
    return () => {
      event.removeEventListener('log', handleLog);
      timerRef.current && clearInterval(timerRef.current);
    };
  }, []);  // ✅ 空依赖，只执行一次

  return (
    <div>
      <ul>
        {/* ✅ 使用唯一 key */}
        {logs.map(log => (
          <li key={log.id}>
            [{log.time?.toLocaleTimeString()}] {log.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 9️⃣ NumberToggle 数字小数点切换

### 🔗 推导链
```
Q1: 需求？
→ 点击按钮切换显示整数/小数

Q2: 核心？
→ boolean state 控制模式
→ Math.floor 取整数部分
```

### 💻 代码
```jsx
import { useState } from 'react';

export default function NumberToggle({ value, decimals = 2 }) {
  const [showDecimal, setShowDecimal] = useState(true);

  const displayValue = showDecimal 
    ? value.toFixed(decimals)
    : Math.floor(value);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 24, fontWeight: 'bold', fontFamily: 'monospace' }}>
        {displayValue}
      </span>
      <button 
        onClick={() => setShowDecimal(!showDecimal)}
        style={{ padding: '4px 12px', cursor: 'pointer' }}
      >
        {showDecimal ? '显示整数' : '显示小数'}
      </button>
    </div>
  );
}

// 使用示例
// <NumberToggle value={3.14159} decimals={3} />
// 点击切换: 3.142 ↔ 3
```

---

## 🔟 CustomAxios 简易请求封装

### 🔗 推导链
```
Q1: 需求？
→ 封装 fetch，支持拦截器、超时、取消

Q2: 核心？
→ 请求拦截：修改 config
→ 响应拦截：处理 response
→ 超时：AbortController + setTimeout
```

### 💻 代码
```javascript
// utils/request.js
class CustomAxios {
  constructor(baseConfig = {}) {
    this.baseURL = baseConfig.baseURL || '';
    this.timeout = baseConfig.timeout || 10000;
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  // 添加请求拦截器
  useRequestInterceptor(fn) {
    this.requestInterceptors.push(fn);
  }

  // 添加响应拦截器
  useResponseInterceptor(fn) {
    this.responseInterceptors.push(fn);
  }

  async request(config) {
    let { url, method = 'GET', headers = {}, data, timeout = this.timeout, signal } = config;
    
    // 执行请求拦截器
    for (const fn of this.requestInterceptors) {
      config = await fn(config);
    }

    // 创建 AbortController 支持取消
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(this.baseURL + url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: signal || controller.signal
      });

      clearTimeout(timeoutId);

      // 执行响应拦截器
      let result = await response.json();
      for (const fn of this.responseInterceptors) {
        result = await fn(result, response);
      }

      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}`);
      }

      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  get(url, config = {}) {
    return this.request({ ...config, url, method: 'GET' });
  }

  post(url, data, config = {}) {
    return this.request({ ...config, url, data, method: 'POST' });
  }

  // 创建取消令牌
  static CancelToken = {
    source: () => {
      const controller = new AbortController();
      return {
        token: controller.signal,
        cancel: (msg) => controller.abort(msg)
      };
    }
  };
}

// 导出单例
export const request = new CustomAxios({ baseURL: '/api', timeout: 15000 });

// 使用示例
/*
// 添加拦截器
request.useRequestInterceptor(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

request.useResponseInterceptor((res, response) => {
  if (res.code === 401) {
    // 跳转到登录
    window.location.href = '/login';
  }
  return res.data;
});

// 发送请求
const data = await request.get('/users');
const result = await request.post('/users', { name: '张三' });

// 取消请求
const { token, cancel } = CustomAxios.CancelToken.source();
request.get('/search', { signal: token });
// 需要时取消
cancel('用户取消搜索');
*/
```

---

## 1️⃣1️⃣ 懒加载组件 React.lazy + Suspense

### 🔗 推导链
```
Q1: 需求？
→ 组件按需加载，减少首屏体积

Q2: 核心？
→ React.lazy(() => import('./Component'))
→ Suspense 包裹，fallback 显示 loading

Q3: 路由懒加载？
→ 结合 React Router，每个路由组件 lazy 加载
```

### 💻 代码
```jsx
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 懒加载组件
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const User = lazy(() => import('./pages/User'));

// Loading 组件
function PageLoading() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div className="spinner">Loading...</div>
    </div>
  );
}

// 错误边界组件
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <div>组件加载失败，请刷新重试</div>;
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/user/:id" element={<User />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
```

### 🔧 手动实现简易 lazy
```typescript
// utils/myLazy.tsx
import React from 'react';

type LazyComponent<P extends object> = React.ComponentType<P> & {
  preload: () => Promise<void>;
};

export function myLazy<P extends object>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>
): LazyComponent<P> {
  let Component: React.ComponentType<P> | null = null;
  let promise: Promise<void> | null = null;

  function LazyComponent(props: P) {
    if (Component) {
      return <Component {...props} />;
    }

    if (!promise) {
      promise = importFn().then(module => {
        Component = module.default;
      });
    }

    throw promise; // Suspense 会捕获这个 Promise
  }

  // 支持预加载
  LazyComponent.preload = () => {
    if (!promise) {
      promise = importFn().then(module => {
        Component = module.default;
      });
    }
    return promise;
  };

  return LazyComponent as LazyComponent<P>;
}
```

---

## 1️⃣2️⃣ 折叠组件 Accordion

### 🔗 推导链
```
Q1: 需求？
→ 树形数据，点击展开/收起子节点

Q2: 核心逻辑？
→ openPath 数组存当前展开的路径，如 [1, 2, 3]
→ isOpen：当前层级是否展开（只看对应层的 id）
→ isActive：是否在路径上（高亮）
→ 点击时：已展开就收起（设为父路径），否则展开（设为当前路径）
→ 一次只展开一条路径，自动实现同级互斥 + 父节点高亮
```

### 💻 代码
```jsx
import { useState } from 'react';

// 模拟数据
const data = [
  { 
    id: 1, title: '一级-1', 
    children: [
      { 
        id: 2, title: '二级-1', 
        children: [{ id: 3, title: '三级-1' }] 
      },
      { id: 4, title: '二级-2' }
    ]
  },
  { id: 5, title: '一级-2' }
];

// 递归渲染组件
function Accordion({ items, path = [], openPath, setOpenPath }) {
  return items.map(item => {
    const curPath = [...path, item.id];
    // 当前层级是否展开：比较对应层级的 id
    const isOpen = openPath[path.length] === item.id;
    // 是否在展开路径上：用于高亮
    const isActive = openPath.includes(item.id);

    return (
      <div key={item.id} style={{ marginLeft: path.length * 20 }}>
        <div
          onClick={() => {
            // 已展开则收起（回到父路径），否则展开当前路径
            setOpenPath(isOpen ? path : curPath);
          }}
          style={{ 
            padding: '8px 12px', 
            cursor: 'pointer',
            background: isActive ? '#e3f2fd' : '#f5f5f5',
            margin: '2px 0',
            borderRadius: 4,
            userSelect: 'none',
            transition: 'background 0.2s'
          }}
        >
          {item.children && (
            <span style={{ marginRight: 4 }}>
              {isOpen ? '▼' : '▶'}
            </span>
          )}
          {item.title}
        </div>
        
        {/* 展开时渲染子节点 */}
        {isOpen && item.children && (
          <Accordion 
            items={item.children} 
            path={curPath} 
            openPath={openPath} 
            setOpenPath={setOpenPath} 
          />
        )}
      </div>
    );
  });
}

export default function App() {
  const [openPath, setOpenPath] = useState([]);
  
  return (
    <div style={{ padding: 16 }}>
      <h3>折叠组件（单路径展开）</h3>
      <Accordion 
        items={data} 
        openPath={openPath} 
        setOpenPath={setOpenPath} 
      />
    </div>
  );
}
```

### 🔧 扩展：支持多路径同时展开
```jsx
// 修改 isOpen 判断逻辑
const isOpen = openPath.some(p => 
  p.length === curPath.length && 
  p.every((id, idx) => id === curPath[idx])
);

// 修改点击逻辑
const handleClick = () => {
  if (isOpen) {
    // 收起：过滤掉当前路径
    setOpenPath(prev => prev.filter(p => 
      !curPath.every((id, idx) => p[idx] === id)
    ));
  } else {
    // 展开：添加当前路径
    setOpenPath(prev => [...prev, curPath]);
  }
};
```

---

> 📌 **使用建议**
> 1. **状态管理**：简单组件用 `useState`，跨组件用 `useContext` 或状态库
> 2. **性能优化**：`useMemo` 缓存计算结果，`useCallback` 缓存函数，虚拟列表处理大数据
> 3. **副作用清理**：`useEffect` 的 return 函数务必清理定时器/事件监听
> 4. **闭包陷阱**：异步回调中用函数式更新或 `useRef` 保存最新值
> 5. **懒加载**：配合 `Suspense` + `ErrorBoundary` 提升用户体验

> ✨ **进阶思考**
> - 虚拟列表：如何支持动态高度 + 滚动位置恢复？
> - 请求封装：如何支持重试机制 + 请求去重？
> - 折叠组件：如何实现动画过渡 + 键盘导航？
> - 闭包修复：如何用 `useEvent` Hook 彻底解决回调依赖问题？