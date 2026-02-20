# 🎨 CSS 实现篇推导链笔记（13 题）

> 高频 CSS 布局/效果题的推导思路 + 变体速查 + 代码实现

---

## 1️⃣ 垂直居中 N 种方法

### 🔗 推导链
```
Q1: 垂直居中是什么？
→ 元素在父容器中垂直方向居中对齐

Q2: 常用方案有哪些？
→ Flex: display: flex + align-items + justify-content
→ Grid: display: grid + place-items: center
→ 定位+transform: top:50% + transform: translate(-50%,-50%)
→ 定位+margin:auto: 四边0 + margin:auto（需已知宽高）
→ line-height: 单行文字，line-height=容器高度
→ table-cell: display: table-cell + vertical-align: middle

Q3: 各方案适用场景？
→ Flex/Grid: 现代布局，最推荐
→ transform: 兼容性好，未知宽高
→ margin auto: 已知宽高，IE8+
→ line-height: 仅单行文字
```

### 📊 方案对比

| 方案 | 兼容性 | 是否需已知宽高 | 水平+垂直 | 推荐度 |
|------|--------|----------------|-----------|--------|
| Flex | IE10+ | ❌ | ✅ | ⭐⭐⭐⭐⭐ |
| Grid | 现代浏览器 | ❌ | ✅ | ⭐⭐⭐⭐ |
| transform | IE9+ | ❌ | ✅ | ⭐⭐⭐⭐⭐ |
| margin auto | IE8+ | ✅ | ✅ | ⭐⭐⭐ |
| line-height | 全兼容 | ✅ | ❌(仅垂直) | ⭐⭐ |
| table-cell | IE8+ | ❌ | ✅ | ⭐⭐ |

### 💻 代码
```css
/* 1. Flex（最常用） */
.parent {
  display: flex;
  justify-content: center;  /* 水平居中 */
  align-items: center;      /* 垂直居中 */
}

/* 2. Grid（最简洁） */
.parent {
  display: grid;
  place-items: center;  /* 水平+垂直居中 */
}

/* 3. 定位 + transform（兼容+未知宽高） */
.parent { position: relative; }
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 4. 定位 + margin auto（已知宽高） */
.parent { position: relative; }
.child {
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  margin: auto;
  width: 100px; height: 100px;
}

/* 5. line-height（单行文字） */
.parent {
  height: 100px;
  line-height: 100px;
  text-align: center;
}

/* 6. table-cell（老方案） */
.parent {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  width: 300px; height: 300px;
}
```

### ❓ 追问点
```
Q: 哪种方案兼容性最好？
→ 定位+transform（IE9+），Flex（IE10+），Grid（现代浏览器）

Q: 行内元素怎么垂直居中？
→ 单行：line-height = 容器高度
→ 多行：vertical-align: middle + display: inline-block + 父元素 font-size:0

Q: transform 的原理？
→ top:50% 把元素左上角移到父元素中心
→ translate(-50%,-50%) 把元素往回移自身宽高的一半
```

---

## 2️⃣ 两栏布局（固定+自适应）

### 🔗 推导链
```
Q1: 两栏布局是什么？
→ 一侧固定宽度，另一侧自适应填满剩余空间

Q2: 常用方案？
→ Flex: 父元素 display:flex，固定侧 width，自适应侧 flex:1
→ Float+BFC: 固定侧 float:left，自适应侧 overflow:hidden 触发 BFC
→ Grid: grid-template-columns: 200px 1fr

Q3: 核心原理？
→ Flex: flex:1 = flex-grow:1 占满剩余空间
→ BFC: 块级格式化上下文不与浮动元素重叠，自动填充
```

### 📊 方案对比

| 方案 | 代码复杂度 | 兼容性 | 推荐度 |
|------|-----------|--------|--------|
| Flex | ⭐ | IE10+ | ⭐⭐⭐⭐⭐ |
| Float+BFC | ⭐⭐ | IE8+ | ⭐⭐⭐ |
| Grid | ⭐ | 现代浏览器 | ⭐⭐⭐⭐ |

### 💻 代码
```css
/* 1. Flex 方案（推荐） */
.container {
  display: flex;
}
.sidebar {
  width: 200px;
  flex-shrink: 0;  /* 防止被压缩 */
}
.main {
  flex: 1;  /* 占满剩余空间 */
  min-width: 0;  /* 允许内容截断 */
}

/* 2. Float + BFC 方案 */
.container { overflow: hidden; }  /* 清除浮动 */
.sidebar {
  float: left;
  width: 200px;
}
.main {
  overflow: hidden;  /* 触发 BFC，不与浮动重叠 */
}

/* 3. Grid 方案 */
.container {
  display: grid;
  grid-template-columns: 200px 1fr;  /* 固定 + 自适应 */
}
```

### ❓ 追问点
```
Q: flex:1 是什么意思？
→ flex:1 = flex-grow:1; flex-shrink:1; flex-basis:0
→ 可以放大占满剩余空间，也可以缩小

Q: 为什么要加 flex-shrink:0？
→ 防止固定宽度的侧边栏在空间不足时被压缩

Q: 为什么要加 min-width:0？
→ Flex 子元素默认 min-width:auto，内容会撑开元素
→ 设置 min-width:0 配合 overflow:hidden 实现文字截断
```

---

## 3️⃣ 三栏布局（圣杯/双飞翼/Flex）

### 🔗 推导链
```
Q1: 三栏布局是什么？
→ 左右两侧固定宽度，中间自适应

Q2: 传统方案（圣杯/双飞翼）核心思想？
→ 中间内容 DOM 排第一（优先加载）
→ 用负 margin 把左右拉到两侧
→ 圣杯：父元素 padding + 子元素 relative 定位
→ 双飞翼：中间多套一层 div，用 margin 留空间

Q3: 现代方案？
→ Flex: 最简单，中间 flex:1
→ Grid: grid-template-columns: 200px 1fr 200px
```

### 📊 方案对比

| 方案 | 核心技巧 | 中间优先加载 | 代码复杂度 |
|------|----------|--------------|-----------|
| 圣杯布局 | 负 margin + relative 定位 | ✅ | ⭐⭐⭐ |
| 双飞翼布局 | 负 margin + 子元素 margin | ✅ | ⭐⭐ |
| Flex | flex:1 | ❌(需 order) | ⭐ |
| Grid | grid-template-columns | ❌(需 order) | ⭐ |

### 💻 代码
```css
/* 1. Flex 方案（推荐） */
.container {
  display: flex;
}
.left { width: 200px; flex-shrink: 0; }
.right { width: 200px; flex-shrink: 0; }
.center { 
  flex: 1; 
  min-width: 0;  /* 允许内容收缩 */
}

/* 2. 双飞翼布局（传统） */
.container { overflow: hidden; }
.left { float: left; width: 200px; margin-left: -100%; }
.right { float: left; width: 200px; margin-left: -200px; }
.center { 
  float: left; 
  width: 100%; 
}
.center-inner { 
  margin: 0 200px;  /* 留出左右空间 */
}

/* 3. Grid 方案 */
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
}
```

### ❓ 追问点
```
Q: 圣杯和双飞翼的区别？
→ 都是让中间 DOM 在前优先加载
→ 圣杯：父 padding + 子 relative 定位
→ 双飞翼：中间子元素 margin，不用定位，更简单

Q: 为什么要让中间内容优先加载？
→ 早期网速慢，中间是主要内容，放 DOM 前面先渲染
→ 现在网速快了，这个优化意义不大

Q: Flex 方案怎么让中间优先加载？
→ DOM 顺序把中间放前面，用 order 属性调整显示顺序
```

---

## 4️⃣ Flex 固定 + 自适应

### 🔗 推导链
```
Q1: 核心问题？
→ Flex 布局中一部分固定大小，另一部分自适应

Q2: flex 属性详解？
→ flex: [grow] [shrink] [basis]
→ flex: 1 = 1 1 0（放大/缩小/初始0）
→ flex: auto = 1 1 auto（初始为内容大小）

Q3: 常见场景？
→ 输入框+按钮：输入框 flex:1，按钮固定
→ 导航栏：logo 固定，菜单 flex:1 居中，用户区固定
```

### 💻 代码
```css
/* 场景：输入框 + 按钮 */
.container {
  display: flex;
  gap: 8px;
}
.input {
  flex: 1;
  min-width: 0;  /* 关键：允许收缩 */
}
.button {
  width: 80px;
  flex-shrink: 0;  /* 防止被压缩 */
}

/* 场景：导航栏 */
.nav {
  display: flex;
  align-items: center;
}
.logo { width: 120px; flex-shrink: 0; }
.menu { 
  flex: 1; 
  display: flex;
  justify-content: center;
}
.user { width: 120px; flex-shrink: 0; text-align: right; }
```

### ❓ 追问点
```
Q: flex:1 和 flex:auto 的区别？
→ flex:1: flex-basis:0，按比例分配所有空间
→ flex:auto: flex-basis:auto，按比例分配剩余空间

Q: 为什么要加 min-width:0？
→ Flex 子元素默认 min-width:auto，内容会撑开不让缩小
→ 设置 min-width:0 才能配合 overflow:hidden 截断文字

Q: flex-shrink 默认值是多少？
→ 默认是 1，空间不足时会按比例缩小
→ 固定宽度的元素要设 flex-shrink:0
```

---

## 5️⃣ 文字截断（单行/多行）

### 🔗 推导链
```
Q1: 单行截断怎么做？
→ overflow: hidden（隐藏溢出）
→ white-space: nowrap（不换行）
→ text-overflow: ellipsis（显示省略号）

Q2: 多行截断怎么做？
→ display: -webkit-box
→ -webkit-box-orient: vertical
→ -webkit-line-clamp: 3（限制行数）
→ overflow: hidden

Q3: Flex 子元素截断注意点？
→ 必须加 min-width: 0，否则内容撑开不截断
```

### 💻 代码
```css
/* 单行截断 */
.ellipsis-single {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 多行截断（3 行） */
.ellipsis-multi {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  word-break: break-all;  /* 防止英文单词溢出 */
}

/* Flex 子元素截断（关键！） */
.flex-item {
  flex: 1;
  min-width: 0;  /* ✅ 关键：允许收缩 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

### ❓ 追问点
```
Q: 多行截断的兼容性？
→ -webkit-line-clamp 现代浏览器都支持（Chrome/Firefox/Safari/Edge）
→ IE 不支持，可用 JS 计算或伪元素模拟

Q: 为什么 Flex 子元素要加 min-width:0？
→ Flex 子元素默认 min-width:auto，内容会撑开元素不让缩小
→ 设置 min-width:0 才能让 overflow:hidden 生效

Q: word-break: break-all 有什么用？
→ 防止长英文单词/URL 溢出容器
→ 配合 text-overflow 使用效果更好
```

---

## 6️⃣ 隐藏元素的方式对比

### 🔗 推导链
```
Q1: 常用隐藏方式？
→ display: none：完全移除，不占空间，不响应事件
→ visibility: hidden：隐藏但占空间，不响应事件
→ opacity: 0：透明但占空间，还能响应事件
→ position: absolute + left:-9999px：移出视口，屏幕阅读器可读

Q2: 性能差异？
→ opacity:0 性能最好（只触发合成层）
→ display:none 性能最差（触发重排）

Q3: 场景选择？
→ 完全移除：display:none
→ 保留占位：visibility:hidden
→ 动画过渡：opacity+transition
→ 无障碍：position 移出视口
```

### 📊 对比表格

| 方式 | 占空间 | 响应事件 | 触发重排 | 屏幕阅读器 | 适用场景 |
|------|--------|----------|----------|-----------|----------|
| display:none | ❌ | ❌ | ✅ | ❌ | Tab 切换、完全移除 |
| visibility:hidden | ✅ | ❌ | ❌(重绘) | ❌ | 保留占位、表格隐藏 |
| opacity:0 | ✅ | ✅ | ❌(合成) | ✅ | 淡入淡出动画 |
| position 移出 | ❌ | ❌ | ❌ | ✅ | 无障碍访问 |

### 💻 代码
```css
/* display: none - 完全隐藏 */
.hidden-display {
  display: none;
}

/* visibility: hidden - 隐藏但占位 */
.hidden-visibility {
  visibility: hidden;
}

/* opacity: 0 - 透明但可交互 */
.hidden-opacity {
  opacity: 0;
  /* 不想响应点击时加 */
  pointer-events: none;
}

/* 移出视口 - 无障碍友好 */
.hidden-visually {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

/* 淡入淡出动画 */
.fade {
  opacity: 0;
  transition: opacity 0.3s;
}
.fade.show {
  opacity: 1;
}
```

### ❓ 追问点
```
Q: 哪种方式性能最好？
→ opacity:0 性能最好，只触发合成层（GPU 加速）
→ display:none 会触发重排（reflow），性能最差

Q: 哪种方式还能响应点击？
→ 只有 opacity:0 还能响应事件
→ 不想响应时加 pointer-events: none

Q: 屏幕阅读器怎么处理？
→ display:none 和 visibility:hidden 会被忽略
→ position 移出视口 + width:1px 还能被读到（无障碍方案）
```

---

## 7️⃣ CSS 画三角形

### 🔗 推导链
```
Q1: 原理是什么？
→ 元素宽高为 0 时，四个边框在交界处形成斜线
→ 每个边框都是一个梯形，content 为 0 时变成三角形

Q2: 画不同方向的三角形？
→ 向上：border-bottom 有色，左右透明
→ 向下：border-top 有色，左右透明
→ 向左/右：同理

Q3: 其他方案？
→ clip-path: polygon() 更灵活
→ SVG 矢量方案
```

### 💻 代码
```css
/* 向上三角形 */
.triangle-up {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid #3498db;
}

/* 向下三角形 */
.triangle-down {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-top: 100px solid #3498db;
}

/* 向右三角形（箭头） */
.triangle-right {
  width: 0;
  height: 0;
  border-top: 50px solid transparent;
  border-bottom: 50px solid transparent;
  border-left: 100px solid #3498db;
}

/* 等边三角形（高 = 边长 × √3/2 ≈ 0.866） */
.triangle-equilateral {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;   /* 底边一半 */
  border-right: 50px solid transparent;
  border-bottom: 86.6px solid #3498db;   /* 高 */
}

/* clip-path 方案（更灵活） */
.triangle-clip {
  width: 100px;
  height: 100px;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  background: #3498db;
}
```

### ❓ 追问点
```
Q: 怎么画等边三角形？
→ 等边三角形的高 = 边长 × √3/2 ≈ 0.866
→ 底边 100px，高约 86.6px，左右 border 各 50px

Q: border 为什么是梯形？
→ border 的交界处是 45°斜线
→ 当 content 区域为 0 时，梯形退化为三角形

Q: 还有什么方式画三角形？
→ clip-path: polygon() 更灵活，可画任意多边形
→ SVG <polygon> 矢量方案，支持动画
```

---

## 8️⃣ inline-block 空格问题

### 🔗 推导链
```
Q1: 问题是什么？
→ inline-block 元素之间有意外间隙

Q2: 原因是什么？
→ HTML 中的换行符/空格被渲染成空白文本节点
→ 空白节点的宽度 = font-size 的 1/3~1/2

Q3: 解决方案？
→ font-size:0（父元素设 0，子元素恢复）
→ Flex 布局（子元素不是 inline，无空格）
→ HTML 写在一行（可读性差）
→ 负 margin（不精确，不推荐）
```

### 💻 代码
```css
/* 方案 1: font-size: 0（常用） */
.container {
  font-size: 0;  /* 消除空白节点宽度 */
}
.container > * {
  font-size: 16px;  /* 子元素恢复字号 */
  display: inline-block;
}

/* 方案 2: Flex 布局（推荐） */
.container {
  display: flex;
  gap: 8px;  /* 用 gap 控制间距，更精确 */
}

/* 方案 3: HTML 写在一行（不推荐） */
/* <div class="container"><span>A</span><span>B</span></div> */

/* 方案 4: 注释连接标签 */
/* <span>A</span><!--
--><span>B</span> */
```

### ❓ 追问点
```
Q: 为什么用 Flex 就没有空格问题？
→ Flex 子元素是 flex item，不是 inline 元素
→ 空白文本节点不会被渲染为间距

Q: 空格的宽度是多少？
→ 大约是 font-size 的 1/3 到 1/2
→ 中文字体的空格通常更宽

Q: gap 属性兼容性？
→ Flex/Grid 的 gap 现代浏览器都支持
→ IE11 不支持 Flex gap，需用 margin 模拟
```

---

## 9️⃣ Tailwind 实现常见组件

### 🔗 推导链
```
Q1: Tailwind 是什么？
→ 原子化 CSS 框架，用预定义类名组合实现样式

Q2: 常见组件实现？
→ Label 标签：inline-flex + rounded-full + bg/text 颜色
→ 遮罩层：fixed inset-0 + bg-black/50 + flex 居中
→ Loading 旋转：animate-spin + border 缺口
→ 按钮：px/py + bg + hover: + transition

Q3: 特殊语法？
→ inset-0 = top/right/bottom/left: 0
→ bg-black/50 = 50% 透明度的黑色
→ [xxx] = 任意值语法
```

### 💻 代码
```html
<!-- Label 标签（药丸形状） -->
<span class="inline-flex items-center px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
  标签
</span>

<!-- 遮罩层 + 居中内容 -->
<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg p-6">
    弹窗内容
  </div>
</div>

<!-- Loading 旋转 -->
<div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>

<!-- 按钮（带 hover 和过渡） -->
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200">
  点击我
</button>

<!-- 响应式布局 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- 内容 -->
</div>
```

### ❓ 追问点
```
Q: Tailwind 的 inset-0 是什么？
→ inset-0 = top:0; right:0; bottom:0; left:0
→ 常用于全屏遮罩或绝对定位填满父元素

Q: bg-black/50 是什么意思？
→ 斜杠后面是透明度
→ bg-black/50 = background-color: rgb(0 0 0 / 0.5)

Q: 怎么自定义动画延迟？
→ 用任意值语法：[animation-delay:0.2s]
→ 方括号里可以写任意 CSS 值
```

---

## 🔟 圆环进度条

### 🔗 推导链
```
Q1: 实现思路？
→ SVG circle + stroke-dasharray + stroke-dashoffset
→ 或 conic-gradient 锥形渐变

Q2: SVG 方案核心？
→ stroke-dasharray = 圆周长（2πr）
→ stroke-dashoffset = 圆周长 × (1 - 进度)
→ rotate -90deg 让起点在顶部

Q3: CSS 方案？
→ conic-gradient(from -90deg, color 0%, color 70%, #eee 70%)
→ 伪元素遮罩中间形成圆环
```

### 💻 代码
```css
/* SVG 方案（推荐，精确控制） */
.progress-ring {
  transform: rotate(-90deg);  /* 起点在顶部 */
}
.progress-ring__circle {
  stroke-dasharray: 283;  /* 2πr = 2×3.14×45 ≈ 283 */
  stroke-dashoffset: 283;  /* 初始为 0% */
  transition: stroke-dashoffset 0.3s;
}
/* 进度 70% */
.progress-70 .progress-ring__circle {
  stroke-dashoffset: 283 * (1 - 0.7) = 84.9;
}

/* CSS conic-gradient 方案 */
.progress-css {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: conic-gradient(
    #3498db 0%, 
    #3498db 70%,  /* 进度 */
    #eee 70%, 
    #eee 100%
  );
  position: relative;
}
.progress-css::after {
  content: '';
  position: absolute;
  inset: 10px;  /* 环的宽度 */
  background: white;
  border-radius: 50%;
}
```

```jsx
// React 组件示例
function ProgressRing({ progress = 0, size = 100, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg className="progress-ring" width={size} height={size}>
      {/* 背景圆环 */}
      <circle
        cx={size/2}
        cy={size/2}
        r={radius}
        stroke="#eee"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* 进度圆环 */}
      <circle
        className="progress-ring__circle"
        cx={size/2}
        cy={size/2}
        r={radius}
        stroke="#3498db"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.3s' }}
      />
      {/* 中间文字 */}
      <text 
        x="50%" 
        y="50%" 
        dominantBaseline="middle" 
        textAnchor="middle"
        fontSize="16"
        fill="#333"
      >
        {progress}%
      </text>
    </svg>
  );
}
```

### ❓ 追问点
```
Q: stroke-dashoffset 怎么计算？
→ offset = circumference × (1 - progress/100)
→ progress=0 时 offset=周长（完全隐藏），progress=100 时 offset=0（完全显示）

Q: 为什么要 rotate(-90deg)？
→ SVG circle 默认起点在 3 点钟方向
→ rotate -90deg 让起点移到 12 点钟方向，符合直觉

Q: conic-gradient 兼容性？
→ 现代浏览器都支持（Chrome/Firefox/Safari/Edge）
→ IE 不支持，需用 SVG 方案
```

---

## 1️⃣1️⃣ 原生 TodoList

### 🔗 推导链
```
Q1: 核心需求？
→ 增删改查 + 完成状态切换 + 数据持久化

Q2: 数据结构？
→ { id, text, completed, createdAt }[]

Q3: 核心技巧？
→ 事件委托：ul 上监听 click，判断 target
→ 数据驱动：修改数组后重新渲染
→ localStorage：JSON.stringify 持久化
```

### 💻 代码
```html
<!DOCTYPE html>
<html>
<body>
  <div class="todo-app">
    <form id="todo-form">
      <input type="text" id="todo-input" placeholder="输入待办事项...">
      <button type="submit">添加</button>
    </form>
    <ul id="todo-list"></ul>
  </div>

  <script>
    class TodoList {
      constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos') || '[]');
        this.form = document.getElementById('todo-form');
        this.input = document.getElementById('todo-input');
        this.list = document.getElementById('todo-list');
        
        this.init();
      }
      
      init() {
        this.form.addEventListener('submit', (e) => this.addTodo(e));
        this.list.addEventListener('click', (e) => this.handleListClick(e));
        this.render();
      }
      
      addTodo(e) {
        e.preventDefault();
        const text = this.input.value.trim();
        if (!text) return;
        
        this.todos.unshift({
          id: Date.now(),
          text,
          completed: false,
          createdAt: new Date().toISOString()
        });
        
        this.input.value = '';
        this.save();
        this.render();
      }
      
      handleListClick(e) {
        const li = e.target.closest('li');
        if (!li) return;
        const id = Number(li.dataset.id);
        
        // 切换完成状态
        if (e.target.classList.contains('toggle')) {
          const todo = this.todos.find(t => t.id === id);
          if (todo) {
            todo.completed = !todo.completed;
            this.save();
            this.render();
          }
        }
        
        // 删除
        if (e.target.classList.contains('delete')) {
          this.todos = this.todos.filter(t => t.id !== id);
          this.save();
          this.render();
        }
      }
      
      save() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
      }
      
      render() {
        this.list.innerHTML = this.todos.map(todo => `
          <li data-id="${todo.id}" class="${todo.completed ? 'completed' : ''}">
            <label>
              <input type="checkbox" class="toggle" ${todo.completed ? 'checked' : ''}>
              <span>${this.escapeHtml(todo.text)}</span>
            </label>
            <button class="delete" type="button">×</button>
          </li>
        `).join('');
      }
      
      escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      }
    }
    
    new TodoList();
  </script>
  
  <style>
    .todo-app { max-width: 500px; margin: 20px auto; }
    #todo-form { display: flex; gap: 8px; margin-bottom: 16px; }
    #todo-input { flex: 1; padding: 8px; }
    #todo-list { list-style: none; padding: 0; }
    #todo-list li { 
      display: flex; 
      justify-content: space-between; 
      padding: 8px; 
      border-bottom: 1px solid #eee;
    }
    #todo-list li.completed span { 
      text-decoration: line-through; 
      color: #999; 
    }
    .delete { 
      background: #f44336; 
      color: white; 
      border: none; 
      border-radius: 4px; 
      cursor: pointer;
      padding: 4px 8px;
    }
  </style>
</body>
</html>
```

### ❓ 追问点
```
Q: 为什么要用事件委托？
→ 减少事件监听器数量，动态添加的 li 也能响应
→ 性能更好，内存占用更少

Q: 怎么防止 XSS 攻击？
→ 用 textContent 或创建 div 转义 HTML
→ 不要直接用 innerHTML 拼接用户输入

Q: localStorage 有什么限制？
→ 同域下 5-10MB 存储空间
→ 只能存字符串，需 JSON.stringify 序列化
→ 同步 API，大数据量会阻塞主线程
```

---

## 1️⃣2️⃣ 原生轮播图

### 🔗 推导链
```
Q1: 核心结构？
→ 容器 overflow:hidden，轨道 flex 横排所有图片

Q2: 切换原理？
→ transform: translateX(-cur * width) 位移轨道
→ cur 取模实现循环：(cur + 1) % total

Q3: 功能点？
→ 按钮切换：cur++ / cur--
→ 指示器：遍历生成，点击跳转
→ 自动播放：setInterval + 鼠标悬停暂停
```

### 💻 代码
```html
<div class="carousel">
  <div class="carousel-track">
    <img src="1.jpg" class="carousel-slide">
    <img src="2.jpg" class="carousel-slide">
    <img src="3.jpg" class="carousel-slide">
  </div>
  
  <button class="carousel-btn prev">❮</button>
  <button class="carousel-btn next">❯</button>
  
  <div class="carousel-indicators"></div>
</div>

<style>
.carousel {
  position: relative;
  width: 600px;
  overflow: hidden;
  margin: 0 auto;
}
.carousel-track {
  display: flex;
  transition: transform 0.3s ease;
}
.carousel-slide {
  min-width: 100%;
  height: 400px;
  object-fit: cover;
}
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}
.carousel-btn.prev { left: 10px; }
.carousel-btn.next { right: 10px; }
.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}
.carousel-indicators button {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid white;
  background: transparent;
  cursor: pointer;
}
.carousel-indicators button.active {
  background: white;
}
</style>

<script>
class Carousel {
  constructor(container) {
    this.container = container;
    this.track = container.querySelector('.carousel-track');
    this.slides = Array.from(container.querySelectorAll('.carousel-slide'));
    this.prevBtn = container.querySelector('.prev');
    this.nextBtn = container.querySelector('.next');
    this.indicators = container.querySelector('.carousel-indicators');
    
    this.cur = 0;
    this.total = this.slides.length;
    this.timer = null;
    
    this.init();
  }
  
  init() {
    // 生成指示器
    this.indicators.innerHTML = this.slides.map((_, i) => 
      `<button data-index="${i}" class="${i===0?'active':''}"></button>`
    ).join('');
    
    // 绑定事件
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());
    this.indicators.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        this.goTo(Number(e.target.dataset.index));
      }
    });
    
    // 悬停暂停自动播放
    this.container.addEventListener('mouseenter', () => this.stop());
    this.container.addEventListener('mouseleave', () => this.start());
    
    this.start();
  }
  
  update() {
    // 移动轨道
    this.track.style.transform = `translateX(-${this.cur * 100}%)`;
    
    // 更新指示器
    this.indicators.querySelectorAll('button').forEach((btn, i) => {
      btn.classList.toggle('active', i === this.cur);
    });
  }
  
  next() {
    this.cur = (this.cur + 1) % this.total;
    this.update();
  }
  
  prev() {
    this.cur = (this.cur - 1 + this.total) % this.total;
    this.update();
  }
  
  goTo(index) {
    this.cur = index;
    this.update();
  }
  
  start() {
    this.timer = setInterval(() => this.next(), 3000);
  }
  
  stop() {
    clearInterval(this.timer);
  }
}

// 初始化
new Carousel(document.querySelector('.carousel'));
</script>
```

### ❓ 追问点
```
Q: 怎么实现无限循环？
→ 简单版：cur 取模 (cur+1)%total
→ 进阶版：克隆首尾图片，滑动到克隆项时瞬间跳回

Q: transition 和 transform 的区别？
→ transform 改变图层位置，触发合成层，性能更好
→ transition 是属性变化的动画过渡效果

Q: 怎么支持触摸滑动？
→ 监听 touchstart/touchmove/touchend
→ 计算滑动距离和方向，判断是否切换
```

---

## 1️⃣3️⃣ clip-path 画几何图形

### 🔗 推导链
```
Q1: clip-path 是什么？
→ CSS 属性，用多边形/圆形/椭圆裁剪元素可见区域

Q2: 语法？
→ polygon(x1 y1, x2 y2, ...)：多边形，坐标用%/px
→ circle(radius at cx cy)：圆形
→ ellipse(rx ry at cx cy)：椭圆

Q3: 常见图形？
→ 三角形：polygon(50% 0%, 0% 100%, 100% 100%)
→ 平行四边形：polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)
→ 六边形：6 个点坐标计算
```

### 💻 代码
```css
/* 三角形 */
.triangle {
  width: 100px;
  height: 100px;
  background: #3498db;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

/* 平行四边形 */
.parallelogram {
  width: 100px;
  height: 100px;
  background: #2ecc71;
  clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);
}

/* 六边形 */
.hexagon {
  width: 100px;
  height: 100px;
  background: #e74c3c;
  clip-path: polygon(
    50% 0%, 
    100% 25%, 
    100% 75%, 
    50% 100%, 
    0% 75%, 
    0% 25%
  );
}

/* 圆形 */
.circle {
  width: 100px;
  height: 100px;
  background: #9b59b6;
  clip-path: circle(50% at 50% 50%);
  /* 或直接用 border-radius: 50% */
}

/* 星形（复杂多边形） */
.star {
  width: 100px;
  height: 100px;
  background: #f1c40f;
  clip-path: polygon(
    50% 0%, 
    63% 38%, 
    100% 38%, 
    69% 59%, 
    82% 100%, 
    50% 75%, 
    18% 100%, 
    31% 59%, 
    0% 38%, 
    37% 38%
  );
}

/* 响应式：用%坐标 */
.responsive-shape {
  width: 100%;
  padding-bottom: 100%;  /* 保持 1:1 比例 */
  background: #34495e;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}
```

```html
<!-- 在线生成工具 -->
<!-- https://bennettfeely.com/clippy/ -->
<!-- https://css-tricks.com/almanac/properties/c/clip-path/ -->
```

### ❓ 追问点
```
Q: clip-path 兼容性？
→ 现代浏览器都支持（Chrome/Firefox/Safari/Edge）
→ IE 不支持，需用 SVG clipPath 或 border 方案降级

Q: 坐标怎么计算？
→ 百分比：相对于元素宽高，(0,0) 是左上角
→ px：绝对像素值
→ 建议用%，方便响应式

Q: clip-path 和 border-radius 的区别？
→ border-radius 只能圆角，clip-path 可裁任意形状
→ clip-path 裁切后点击区域也变了，border-radius 不影响
```

---

> 📌 **使用建议**
> 1. **布局方案**：优先用 Flex/Grid，传统方案了解原理即可
> 2. **性能优化**：动画用 transform/opacity，避免重排属性
> 3. **兼容性**：关键功能准备降级方案，用 @supports 检测
> 4. **可访问性**：隐藏元素时考虑屏幕阅读器，用 position 移出视口
> 5. **CSS 画图**：简单图形用 CSS，复杂用 SVG

> ✨ **进阶思考**
> - 垂直居中：如何用 CSS Container Queries 实现响应式居中？
> - 虚拟列表：CSS scroll-snap 能否替代 JS 虚拟滚动？
> - 进度条：如何用 CSS Houdini 实现自定义动画曲线？
> - 轮播图：如何用 CSS scroll-snap-type 实现纯 CSS 轮播？