# frontend hot80

## 致谢与来源

本文档与代码实践主要来源于牛客讨论帖：  
https://www.nowcoder.com/discuss/844536328413773824

感谢原作者整理的高质量题解与思路。

## 项目目标

- 将文档知识点拆解成 `src/` 下的最小可运行实现
- 为每个主题补齐 `test/` 下的自动化测试
- 通过测试快速验证理解是否正确，避免只看不练

## 目录与测试方式

### 1) 纯算法/逻辑目录（Node 单元测试）

- `src/promise` / `src/async` / `src/patterns`
- `src/array-object`
- `src/data-structures`

测试方式：
- 运行在 `vitest` 的 Node 环境
- 重点验证输入输出、边界条件、错误分支、异步时序

示例测试文件：
- `test/promise/*.test.js`
- `test/async/*.test.js`
- `test/array-object/core.test.js`
- `test/data-structures/core.test.js`

### 2) React 目录（组件/Hook 测试）

- `src/react/hooks.js`
- `src/react/components.jsx`

测试方式：
- `vitest + jsdom + @testing-library/react`
- 用 `render` / `renderHook` 模拟用户交互与 Hook 生命周期
- 使用 fake timers 验证 debounce/throttle/request 等时间相关行为

示例测试文件：
- `test/react/hooks.test.jsx`
- `test/react/components.test.jsx`

### 3) CSS/DOM 场景目录（浏览器行为模拟测试）

- `src/css/browserDemos.js`

测试方式：
- `vitest + jsdom`
- 通过 DOM 事件模拟（点击、切换、轮播）和样式数据断言进行验证
- 说明：`jsdom` 不做真实像素布局渲染，主要验证结构、状态和逻辑

示例测试文件：
- `test/css/browserDemos.test.js`

## 依赖说明

核心依赖：
- `react`
- `react-dom`

测试依赖：
- `vitest`
- `@testing-library/react`
- `jsdom`

详见 `package.json`。

## 启动与使用

```bash
pnpm install
pnpm test
pnpm test:watch
```

## Prompt 简要总结

这个项目的 Prompt 核心是：
- 根据文档内容分主题创建源码目录
- 为每个主题补可执行测试
- 对不同类型内容使用不同测试策略（算法用 Node 单测，React/CSS 用 jsdom 浏览器模式）
- 目标是把“可阅读笔记”升级为“可执行、可验证”的知识库
