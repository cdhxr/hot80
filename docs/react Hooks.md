# ⚛️ React Hooks 推导链笔记（7 题）

> 高频 React Hooks 的推导思路 + 变体速查 + 代码实现

---

## 1️⃣ useDebounce 防抖 Hook

### 🔗 推导链
```
Q1: 和 JS 防抖区别？
→ JS 防抖返回函数，Hook 返回防抖后的**值**
→ 值变化后延迟更新，适合搜索输入场景

Q2: 核心实现？
→ useEffect 监听值变化
→ setTimeout 延迟更新
→ cleanup 清除上一次定时器

Q3: 两种形态？
→ useDebounceValue：返回防抖后的值（输入框场景）
→ useDebounceFn：返回防抖后的函数（事件处理场景）
```

### 📊 变体速查

| 形态 | 返回值 | 适用场景 |
|------|--------|----------|
| useDebounceValue | `debouncedValue` | 搜索框输入、表单联动 |
| useDebounceFn | `debouncedFn` | 按钮点击、resize 事件 |

### 💻 代码
```tsx
import { useState, useEffect, useRef, useCallback } from 'react';

// useDebounceValue：返回防抖后的值
function useDebounceValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// useDebounceFn：返回防抖后的函数
function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  options?: { leading?: boolean }
) {
  const timerRef = useRef<NodeJS.Timeout>();
  const fnRef = useRef(fn);
  const leadingRef = useRef(options?.leading);
  const lastCallRef = useRef(0);

  // 保持 fn 最新
  useEffect(() => { fnRef.current = fn; }, [fn]);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const callNow = leadingRef.current && !timerRef.current;

    if (timerRef.current) clearTimeout(timerRef.current);

    if (callNow && now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      fnRef.current(...args);
      return;
    }

    timerRef.current = setTimeout(() => {
      lastCallRef.current = Date.now();
      fnRef.current(...args);
      timerRef.current = undefined;
    }, delay);
  }, [delay]);
}

// 使用示例
function SearchBox() {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounceValue(keyword, 300);

  useEffect(() => {
    if (debouncedKeyword) {
      // 发起搜索请求
      console.log('搜索:', debouncedKeyword);
    }
  }, [debouncedKeyword]);

  return <input value={keyword} onChange={e => setKeyword(e.target.value)} />;
}

function DebouncedButton() {
  const handleClick = useDebounceFn(() => {
    console.log('按钮点击');
  }, 1000);

  return <button onClick={handleClick}>防抖按钮</button>;
}
```

### ❓ 追问点
```
Q: 为什么要用 useRef 保存 fn？
→ 避免 debounce 函数每次重新创建，保持引用稳定
→ 同时确保回调能访问最新的函数逻辑

Q: leading 参数的作用？
→ leading: true 表示首次立即执行
→ 适合按钮防重复点击场景

Q: 依赖数组为什么是 [value, delay]？
→ value 变化时重新计时
→ delay 变化时重新创建定时器
```

---

## 2️⃣ useThrottle 节流 Hook

### 🔗 推导链
```
Q1: 和防抖区别？
→ 防抖：停止触发后才执行（等用户停手）
→ 节流：固定间隔执行一次（不管触发多频繁）

Q2: 核心实现？
→ useRef 记录上次执行时间
→ 判断时间差是否超过间隔
→ 可选 trailing 保证最后一次执行

Q3: 两种形态？
→ useThrottleValue：返回节流后的值
→ useThrottleFn：返回节流后的函数
```

### 📊 变体速查

| 形态 | 特点 | 适用场景 |
|------|------|----------|
| 时间戳版 | 首次立即执行，停止后不再执行 | 滚动加载、鼠标移动 |
| 定时器版 | 首次等待，停止后可能再执行 | 按钮点击限流 |
| 组合版 ✅ | 首次立即 + 停止后还执行一次 | 最常用，体验最好 |

### 💻 代码
```tsx
import { useRef, useCallback, useEffect } from 'react';

// useThrottleFn：返回节流后的函数（组合版）
function useThrottleFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  options?: { trailing?: boolean }
) {
  const timerRef = useRef<NodeJS.Timeout>();
  const lastTimeRef = useRef(0);
  const fnRef = useRef(fn);
  const trailingRef = useRef(options?.trailing);

  useEffect(() => { fnRef.current = fn; }, [fn]);

  useEffect(() => {
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, []);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = delay - (now - lastTimeRef.current);

    // 立即执行条件
    if (remaining <= 0) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
      lastTimeRef.current = now;
      fnRef.current(...args);
      return;
    }

    // trailing：保证停止后还能执行一次
    if (trailingRef.current && !timerRef.current) {
      timerRef.current = setTimeout(() => {
        lastTimeRef.current = Date.now();
        timerRef.current = undefined;
        fnRef.current(...args);
      }, remaining);
    }
  }, [delay]);
}

// useThrottleValue：返回节流后的值
function useThrottleValue<T>(value: T, delay: number): T {
  const [throttled, setThrottled] = useState(value);
  const lastTimeRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    const now = Date.now();
    const remaining = delay - (now - lastTimeRef.current);

    if (remaining <= 0) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
      lastTimeRef.current = now;
      setThrottled(value);
    } else if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        lastTimeRef.current = Date.now();
        timerRef.current = undefined;
        setThrottled(value);
      }, remaining);
    }
  }, [value, delay]);

  return throttled;
}

// 使用示例
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);
  
  // 节流滚动事件，100ms 更新一次
  const handleScroll = useThrottleFn((e: Event) => {
    setScrollY(window.scrollY);
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return <div>滚动位置: {scrollY}px</div>;
}
```

### ❓ 追问点
```
Q: trailing 参数的作用？
→ 保证停止触发后，还能执行最后一次
→ 避免用户快速操作后，最后一次被丢弃

Q: 为什么用 useRef 而不是 state 存时间？
→ useRef 更新不会触发重渲染
→ 时间戳只是内部状态，不需要通知组件更新

Q: 节流和防抖怎么选？
→ 防抖：用户停止操作后才执行（搜索、输入校验）
→ 节流：固定频率执行（滚动、拖拽、按钮限流）
```

---

## 3️⃣ useUpdateEffect 跳过首次执行

### 🔗 推导链
```
Q1: 为什么需要？
→ useEffect 首次渲染也会执行
→ 有时只想在依赖更新时执行，不想首次执行
→ 场景：数据变化时发请求，但初始化时不请求

Q2: 核心实现？
→ useRef 记录是否首次渲染
→ 首次渲染跳过，后续正常执行

Q3: 和 useEffect 的签名区别？
→ 完全一致，只是内部跳过首次
→ 迁移成本为 0
```

### 💻 代码
```tsx
import { useEffect, useRef, EffectCallback, DependencyList } from 'react';

function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    return effect();
  }, deps);
}

// 使用示例
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);

  // 首次渲染不请求，userId 变化时才请求
  useUpdateEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  // 对比：useEffect 首次也会执行
  // useEffect(() => {
  //   fetchUser(userId).then(setUser);
  // }, [userId]);

  return <div>{user?.name}</div>;
}

// 进阶：支持条件跳过
function useConditionalEffect(
  effect: EffectCallback,
  deps: DependencyList,
  shouldRun: boolean
) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (shouldRun) {
      return effect();
    }
  }, [...deps, shouldRun]);
}
```

### ❓ 追问点
```
Q: 为什么不用 useState 记录首次？
→ useState 更新会触发重渲染，造成死循环
→ useRef 更新不会触发渲染，适合存内部标记

Q: 清理函数怎么处理？
→ 首次跳过时，effect() 的返回值（清理函数）也不会执行
→ 符合预期：首次不需要清理

Q: 和 useMount/useUnmount 的关系？
→ useUpdateEffect = useEffect - useMount
→ 可以组合使用：useMount(初始化) + useUpdateEffect(更新)
```

---

## 4️⃣ usePrevious 获取上一次的值

### 🔗 推导链
```
Q1: 为什么需要？
→ 对比前后值的变化
→ 实现动画过渡、变化检测、历史对比

Q2: 核心实现？
→ useRef 存储上一次的值
→ useEffect 在渲染后更新 ref
→ 先返回旧值，再更新为新值

Q3: 为什么用 useEffect？
→ useEffect 在 DOM 渲染后执行
→ 保证本次 render 拿到的是上一次的值
```

### 💻 代码
```tsx
import { useRef, useEffect } from 'react';

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// 泛型增强版：支持初始值
function usePrevious<T>(value: T, initialValue?: T): T {
  const ref = useRef<T>(initialValue);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// 使用示例
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>当前: {count}, 上次: {prevCount}</p>
      {/* 检测变化方向 */}
      {prevCount !== undefined && (
        <span>{count > prevCount ? '↑ 增加' : '↓ 减少'}</span>
      )}
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
}

// 场景：动画过渡
function AnimatedNumber({ value }: { value: number }) {
  const prevValue = usePrevious(value);
  
  // 根据变化方向决定动画
  const direction = value > (prevValue ?? value) ? 'up' : 'down';
  
  return (
    <span className={`animate-${direction}`}>
      {value}
    </span>
  );
}

// 场景：检测 URL 变化
function PageTracker({ pathname }: { pathname: string }) {
  const prevPath = usePrevious(pathname);
  
  useEffect(() => {
    if (prevPath && prevPath !== pathname) {
      // 页面切换时上报
      reportPageView(pathname, prevPath);
    }
  }, [pathname, prevPath]);
  
  return null;
}
```

### ❓ 追问点
```
Q: 第一次渲染返回什么？
→ 返回 undefined（或 initialValue）
→ 因为还没有"上一次"的值

Q: 为什么不在 render 时直接更新 ref？
→ 那样本次 render 拿到的就是新值了
→ useEffect 保证"先返回旧值，再更新 ref"

Q: 能用于对象/数组吗？
→ 可以，但要注意引用相等
→ 如果对象内容变但引用不变，usePrevious 检测不到变化
```

---

## 5️⃣ useRequest 请求 Hook

### 🔗 推导链
```
Q1: 核心功能？
→ 封装请求的 loading/data/error 三态
→ 支持手动触发、自动请求、轮询、缓存

Q2: options 有哪些？
→ manual：手动触发，不自动请求
→ onSuccess/onError：成功/失败回调
→ pollingInterval：轮询间隔
→ cacheKey：缓存 key

Q3: 返回什么？
→ data、loading、error：请求状态
→ run：手动触发函数
→ refresh：用上次参数重新请求
→ cancel：取消请求
```

### 📊 核心设计

```
┌─────────────────────────┐
│  useRequest(serviceFn)  │
├─────────────────────────┤
│ 返回：                  │
│  • data: 响应数据       │
│  • loading: 加载状态    │
│  • error: 错误信息      │
│  • run: 手动触发        │
│  • refresh: 重新请求    │
│  • cancel: 取消请求     │
├─────────────────────────┤
│ 配置：                  │
│  • manual: 是否手动触发 │
│  • onSuccess/onError    │
│  • pollingInterval      │
│  • cacheKey             │
└─────────────────────────┘
```

### 💻 代码
```tsx
import { useState, useEffect, useRef, useCallback } from 'react';

interface Options<T> {
  manual?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  pollingInterval?: number;
}

interface Result<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | undefined;
  run: (...args: any[]) => Promise<T>;
  refresh: () => Promise<T>;
  cancel: () => void;
}

function useRequest<T>(
  serviceFn: (...args: any[]) => Promise<T>,
  options: Options<T> = {}
): Result<T> {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(!options.manual);
  const [error, setError] = useState<Error>();
  
  const paramsRef = useRef<any[]>();
  const timerRef = useRef<NodeJS.Timeout>();
  const controllerRef = useRef<AbortController>();
  const mountedRef = useRef(true);

  // 清理函数
  const cleanup = useCallback(() => {
    timerRef.current && clearInterval(timerRef.current);
    controllerRef.current?.abort();
  }, []);

  // 卸载时清理
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  // 核心请求函数
  const run = useCallback(async (...args: any[]) => {
    // 取消上一次请求
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    
    paramsRef.current = args;
    setLoading(true);
    setError(undefined);

    try {
      const result = await serviceFn(...args);
      if (mountedRef.current) {
        setData(result);
        options.onSuccess?.(result);
      }
      return result;
    } catch (err) {
      if (mountedRef.current && (err as Error).name !== 'AbortError') {
        setError(err as Error);
        options.onError?.(err as Error);
      }
      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [serviceFn, options]);

  // 刷新：用上次参数重新请求
  const refresh = useCallback(() => {
    return paramsRef.current 
      ? run(...paramsRef.current) 
      : run();
  }, [run]);

  // 取消请求
  const cancel = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  // 自动请求
  useEffect(() => {
    if (!options.manual) {
      run();
    }
  }, [run, options.manual]);

  // 轮询
  useEffect(() => {
    if (options.pollingInterval && !options.manual) {
      timerRef.current = setInterval(refresh, options.pollingInterval);
      return () => clearInterval(timerRef.current!);
    }
  }, [refresh, options.pollingInterval, options.manual]);

  return { data, loading, error, run, refresh, cancel };
}

// 使用示例
function UserList() {
  const { data, loading, error, refresh } = useRequest(
    () => fetch('/api/users').then(res => res.json()),
    { 
      pollingInterval: 30000,  // 30 秒轮询
      onError: (err) => console.error('请求失败:', err)
    }
  );

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;

  return (
    <div>
      <button onClick={refresh}>刷新</button>
      <ul>
        {data?.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
    </div>
  );
}

// 手动触发示例
function SearchComponent() {
  const { data, loading, run } = useRequest(
    (keyword: string) => fetch(`/api/search?q=${keyword}`).then(res => res.json()),
    { manual: true }  // 手动触发
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const keyword = (e.target as HTMLFormElement).keyword.value;
    run(keyword);
  };

  return (
    <form onSubmit={handleSearch}>
      <input name="keyword" />
      <button type="submit" disabled={loading}>
        {loading ? '搜索中...' : '搜索'}
      </button>
    </form>
  );
}
```

### ❓ 追问点
```
Q: 为什么要用 AbortController？
→ 组件卸载或参数变化时取消 pending 请求
→ 避免内存泄漏和"setState on unmounted component"警告

Q: 轮询怎么实现的？
→ setInterval 定期调用 refresh
→ refresh 用上次参数重新执行 run
→ 组件卸载时 clearInterval 清理

Q: 缓存怎么实现？
→ 用 cacheKey + Map/WeakMap 存储请求结果
→ 下次相同参数直接返回缓存
→ 可配置 staleTime 控制缓存过期
```

---

## 6️⃣ 模拟 useState

### 🔗 推导链
```
Q1: useState 原理？
→ 闭包 + 数组存储状态
→ 每个组件实例有自己的 state 数组
→ hook 按调用顺序从数组中取值

Q2: 为什么用数组？
→ 多个 useState 按调用顺序存储
→ 索引对应每个 state，O(1) 访问
→ 不需要 key，靠顺序保证一致性

Q3: 为什么不能放条件语句？
→ 每次渲染从头遍历 hooks 数组
→ 条件语句会打乱调用顺序
→ 导致索引错乱，state 对应错误
```

### 🧠 核心原理图

```
组件渲染流程：
┌─────────────────┐
│ 1. 创建/获取组件实例 │
│    - hooks: []      │
└────────┬────────┘
         ▼
┌─────────────────┐
│ 2. 执行组件函数   │
│    useState(0)   │ → hooks[0] = { state: 0, queue: [] }
│    useState('')  │ → hooks[1] = { state: '', queue: [] }
│    useEffect(...)│ → hooks[2] = { effect, deps }
└────────┬────────┘
         ▼
┌─────────────────┐
│ 3. 返回 JSX      │
│ 4. 执行 effect   │
└─────────────────┘

下次渲染：
- 相同索引取相同 hook
- setState 更新对应 hook 的 state
- 触发重新渲染
```

### 💻 代码
```tsx
// 简易版：理解原理
let currentComponent: ComponentInstance | null = null;
let currentHookIndex = 0;

interface Hook {
  state: any;
  queue: Array<(prev: any) => any>;
  effect?: { callback: () => void; deps?: any[] };
}

interface ComponentInstance {
  hooks: Hook[];
  render: () => any;
}

function createComponent(render: () => any): ComponentInstance {
  return {
    hooks: [],
    render
  };
}

function useState<T>(initialState: T | (() => T)): [T, (newState: T) => void] {
  if (!currentComponent) throw new Error('useState must be called in component');
  
  const hookIndex = currentHookIndex++;
  const hooks = currentComponent.hooks;
  
  // 首次初始化
  if (!hooks[hookIndex]) {
    hooks[hookIndex] = {
      state: typeof initialState === 'function' 
        ? (initialState as () => T)() 
        : initialState,
      queue: []
    };
  }
  
  const hook = hooks[hookIndex];
  
  const setState = (newState: any) => {
    // 支持函数式更新
    const value = typeof newState === 'function' 
      ? newState(hook.state) 
      : newState;
    
    hook.state = value;
    // 实际 React 这里会调度重新渲染
    currentComponent?.render();
  };
  
  return [hook.state, setState];
}

function useEffect(callback: () => void, deps?: any[]) {
  if (!currentComponent) throw new Error('useEffect must be called in component');
  
  const hookIndex = currentHookIndex++;
  const hooks = currentComponent.hooks;
  const prevHook = hooks[hookIndex];
  
  // 依赖变化或首次执行
  const shouldRun = !prevHook || !deps || deps.some((d, i) => d !== prevHook.deps?.[i]);
  
  if (shouldRun) {
    hooks[hookIndex] = { state: null, queue: [], effect: { callback, deps } };
    callback();
  }
}

// 重置索引（每次渲染前调用）
function resetHooks() {
  currentHookIndex = 0;
}

// 使用示例
let app: ComponentInstance;

function Counter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('React');
  
  useEffect(() => {
    console.log('count 变化:', count);
  }, [count]);
  
  return { count, name, setCount, setName };
}

// 模拟渲染
app = createComponent(Counter);
currentComponent = app;

resetHooks();
const result1 = app.render();  // { count: 0, name: 'React' }

resetHooks();
result1.setCount(1);  // 触发更新
const result2 = app.render();  // { count: 1, name: 'React' }
```

### ❓ 追问点
```
Q: 为什么 hooks 顺序不能变？
→ React 用链表/数组按顺序存储 hooks
→ 每次渲染按相同顺序读取，索引对应关系必须一致
→ 条件语句会导致顺序错乱，state 对应错误

Q: 函数式更新怎么实现？
→ setState 接收函数时，用 prev => fn(prev) 计算新值
→ 保证基于最新 state 计算，避免闭包问题

Q: 实际 React 怎么调度更新？
→ 不是立即执行 render
→ 用 Scheduler 批量处理更新，合并多次 setState
→ 配合 Fiber 架构实现可中断渲染
```

---

## 7️⃣ useRedux 简易状态管理

### 🔗 推导链
```
Q1: Redux 核心？
→ 单一 store + reducer + dispatch
→ 纯函数更新，状态变化通知订阅者
→ 时间旅行调试、中间件扩展

Q2: Hook 版怎么实现？
→ useReducer 管理状态（替代 Redux reducer）
→ Context 跨组件共享 store
→ useSyncExternalStore 订阅外部 store（React 18）

Q3: 简易版 vs 完整版？
→ 简易版：Context + useReducer（适合中小项目）
→ 完整版：createStore + subscribe + useSyncExternalStore（模拟 Redux）
```

### 📊 方案对比

| 方案 | 核心 API | 适用场景 | 复杂度 |
|------|----------|----------|--------|
| Context+useReducer | createContext + useReducer | 中小应用、局部状态 | ⭐⭐ |
| useSyncExternalStore | subscribe + getSnapshot | 模拟 Redux、外部 store | ⭐⭐⭐ |
| Redux Toolkit | configureStore + createSlice | 大型应用、复杂状态 | ⭐⭐⭐⭐ |

### 💻 代码（简易版：Context + useReducer）
```tsx
import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';

// 状态和动作类型
interface State {
  count: number;
  user: { name: string } | null;
}

type Action = 
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET_USER'; payload: { name: string } }
  | { type: 'LOGOUT' };

// 初始状态
const initialState: State = { count: 0, user: null };

// Reducer 纯函数
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
}

// Context 类型
interface StoreContextType {
  state: State;
  dispatch: Dispatch<Action>;
}

const StoreContext = createContext<StoreContextType | null>(null);

// Provider 组件
function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

// 自定义 Hook
function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}

// 可选：封装 selector Hook，避免不必要的重渲染
function useSelector<T>(selector: (state: State) => T): T {
  const { state } = useStore();
  return selector(state);
}

function useDispatch() {
  const { dispatch } = useStore();
  return dispatch;
}

// 使用示例
function Counter() {
  const count = useSelector(state => state.count);
  const dispatch = useDispatch();
  
  return (
    <div>
      <span>{count}</span>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
    </div>
  );
}

function UserProfile() {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  
  if (!user) {
    return <button onClick={() => dispatch({ type: 'SET_USER', payload: { name: '张三' } })}>
      登录
    </button>;
  }
  
  return (
    <div>
      欢迎, {user.name}
      <button onClick={() => dispatch({ type: 'LOGOUT' })}>退出</button>
    </div>
  );
}

// 根组件
function App() {
  return (
    <StoreProvider>
      <Counter />
      <UserProfile />
    </StoreProvider>
  );
}
```

### 💻 代码（进阶版：模拟 Redux + useSyncExternalStore）
```tsx
import { useSyncExternalStore } from 'react';

// 类型定义
type Listener = () => void;
type Reducer<S, A> = (state: S, action: A) => S;

// 创建 store
function createStore<S, A>(reducer: Reducer<S, A>, initialState: S) {
  let state = initialState;
  const listeners = new Set<Listener>();

  const getState = () => state;

  const dispatch = (action: A) => {
    state = reducer(state, action);
    // 通知所有订阅者
    listeners.forEach(listener => listener());
  };

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { getState, dispatch, subscribe };
}

// 创建全局 store
const store = createStore(reducer, initialState);

// useSelector Hook（使用 useSyncExternalStore）
function useSelector<T>(selector: (state: State) => T): T {
  return useSyncExternalStore(
    store.subscribe,  // 订阅函数
    () => selector(store.getState()),  // 获取快照（渲染时用）
    () => selector(store.getState())   // 获取服务器快照（SSR 时用）
  );
}

// useDispatch Hook
function useDispatch() {
  return store.dispatch;
}

// 使用示例（和简易版一样）
function Counter() {
  const count = useSelector(state => state.count);
  const dispatch = useDispatch();
  
  return (
    <div>
      <span>{count}</span>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
    </div>
  );
}
```

### ❓ 追问点
```
Q: useSyncExternalStore 的作用？
→ React 18 新增 Hook，用于订阅外部数据源
→ 自动处理并发渲染、优先级调度
→ 替代手动 useEffect + useState 订阅模式

Q: 为什么 selector 要放在 useSyncExternalStore 里？
→ 确保每次渲染都获取最新快照
→ 避免闭包导致拿到旧 state
→ React 会智能比较，避免不必要的重渲染

Q: 和 Redux Toolkit 怎么选？
→ 简易版：小项目、学习原理、快速原型
→ Redux Toolkit：大项目、需要 DevTools/中间件/时间旅行
→ Zustand/Jotai：更轻量的替代方案
```

---

> 📌 **使用建议**
> 1. **防抖/节流 Hook**：搜索用 `useDebounceValue`，事件用 `useDebounceFn`
> 2. **useUpdateEffect**：数据变化发请求时替代 `useEffect`，避免首次重复请求
> 3. **usePrevious**：对比变化、实现过渡动画，注意首次返回 `undefined`
> 4. **useRequest**：封装请求三态，注意清理 `AbortController` 防内存泄漏
> 5. **Hooks 规则**：只能在函数组件顶层调用，不能放条件/循环中
> 6. **状态管理**：小项目用 `Context+useReducer`，大项目用 `Redux Toolkit`

> ✨ **进阶思考**
> - 防抖 Hook：如何用 `useTransition` 实现并发防抖？
> - useRequest：如何支持缓存 +  stale-while-revalidate 策略？
> - 状态管理：如何用 `useReducer + immer` 简化不可变更新？
> - 自定义 Hook：如何设计可组合、类型安全的 Hook API？