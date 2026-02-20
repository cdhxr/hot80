# frontend hot80

## 致谢与来源

本文档与代码实践主要来源于牛客讨论帖：  
https://www.nowcoder.com/discuss/844536328413773824

感谢原作者整理的高质量题解与思路。

## 项目目标

- 将文档知识点拆解成 `answer/` 下的最小可运行实现
- 提供 `Todos/` 空函数骨架，按推导链补全练习
- 为每个主题补齐 `test/` 下的自动化测试
- 通过测试快速验证理解是否正确，避免只看不练

## 目录说明

- `answer/`: 完整参考实现（默认测试目标）
- `Todos/`: 练习骨架（含推导链注释 + TODO 注释）
- `src/`: 历史实现目录（保留）

## 目录与测试方式

### 1) 纯算法/逻辑目录（Node 单元测试）

- `answer/promise` / `answer/async` / `answer/patterns`
- `answer/array-object`
- `answer/data-structures`

测试方式：
- 运行在 `vitest` 的 Node 环境
- 重点验证输入输出、边界条件、错误分支、异步时序

示例测试文件：
- `test/promise/*.test.js`
- `test/async/*.test.js`
- `test/array-object/core.test.js`
- `test/data-structures/core.test.js`

### 2) React 目录（组件/Hook 测试）

- `answer/react/hooks.js`
- `answer/react/components.jsx`

测试方式：
- `vitest + jsdom + @testing-library/react`
- 用 `render` / `renderHook` 模拟用户交互与 Hook 生命周期
- 使用 fake timers 验证 debounce/throttle/request 等时间相关行为

示例测试文件：
- `test/react/hooks.test.jsx`
- `test/react/components.test.jsx`

### 3) CSS/DOM 场景目录（浏览器行为模拟测试）

- `answer/css/browserDemos.js`

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
- `@vitest/browser`
- `playwright`

详见 `package.json`。

## 启动与使用

```bash
pnpm install
pnpm test
pnpm test:watch
pnpm test:todos
pnpm test:browser
```

- `pnpm test`: 运行 `answer/` 参考实现（默认）
- `pnpm test:todos`: 运行 `Todos/` 练习骨架（你补全后用于验收）
- `pnpm test:browser`: 运行 Browser Mode 用例（真实浏览器）

## 测试目标切换说明

- 测试文件统一从 `@target/*` 导入代码
- 默认情况下（未设置 `HOT80_TARGET`），`@target` 指向 `answer/`
- 设置 `HOT80_TARGET=Todos` 后，`@target` 指向 `Todos/`

### 单文件测试示例（以 MyPromise 为例）

- 默认测 `answer`（会通过）：
```powershell
pnpm exec vitest run test/promise/myPromise.test.js
```

- 测 `Todos`（用于验收你自己填写的实现）：
```powershell
$env:HOT80_TARGET='Todos'; pnpm exec vitest run test/promise/myPromise.test.js
```

- 也可以用脚本（默认跑 `Todos` 全量）：
```powershell
pnpm test:todos
```

## Browser Mode（组件/CSS 真实浏览器测试）

- 配置文件：`vitest.browser.config.js`
- 用例目录：`test/browser/**/*.browser.test.{js,jsx}`
- 默认 provider：`playwright`（`chromium`）
- 说明：这是在现有 `jsdom` 基础上的补充层，不替代原有单元测试

首次使用需要安装浏览器内核：

```powershell
pnpm exec playwright install chromium
```

运行命令：

```powershell
pnpm test:browser
pnpm test:browser:watch
pnpm test:todos:browser
```

## Todos 占位函数说明

- `Todos/` 目录里的很多函数会看到类似：
```js
return todo("MyPromise.then");
```
- 这里的 `todo()` 是故意放的“未完成占位符”，会直接抛出错误：
  - `Error: TODO: MyPromise.then`
- 目的：让你一运行测试就能准确定位到还没实现的函数。
- 当你开始实现该题时，把对应的 `return todo("...")` 删除，改成真实逻辑即可。

## Prompt 简要总结

项目基本是vibe coding
这个项目的 Prompt 核心是：
- 根据文档内容分主题创建源码目录
- 为每个主题补可执行测试
- 对不同类型内容使用不同测试策略（算法用 Node 单测，React/CSS 以 jsdom 为主，关键交互补充 Browser Mode）
- 目标是把“可阅读笔记”升级为“可执行、可验证”的知识库
