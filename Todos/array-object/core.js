// 单文件测试（Todos）: $env:HOT80_TARGET='Todos'; pnpm exec vitest run test/array-object/core.test.js
function todo(name) {
  throw new Error(`TODO: ${name}`);
}

function isObjectLike(value) {
  // TODO: 判断是否为非 null 的对象类型
  return todo("isObjectLike");
}

function parsePath(path) {
  // 推导链:
  // 1) 支持 a.b[0].c 这种路径格式
  // 2) 统一转成 ["a", "b", "0", "c"]
  // TODO: 实现路径解析
  return todo("parsePath");
}

export function deepClone(obj, hash = new WeakMap()) {
  // 推导链:
  // 1) 基本类型/null 直接返回
  // 2) WeakMap 处理循环引用
  // 3) Date/RegExp/Map/Set 分支处理
  // 4) Array/Object 递归拷贝
  // TODO: 按上述步骤完成 deepClone
  return todo("deepClone");
}

export function deepEqual(a, b) {
  // 推导链:
  // 1) 先处理全等、null、类型不同
  // 2) 特殊对象 Date/RegExp/Map/Set 单独比较
  // 3) Array/Object 递归比较结构和值
  // TODO: 实现深比较
  return todo("deepEqual");
}

export function get(obj, path, defaultValue) {
  // 推导链:
  // 1) 先把路径解析为 key 数组
  // 2) 逐层安全取值，遇到 null/undefined 返回默认值
  // TODO: 实现安全取值
  return todo("get");
}

export function set(obj, path, value) {
  // 推导链:
  // 1) 先解析路径
  // 2) 中间层不存在时自动创建 {} 或 []
  // 3) 最后一层赋值并返回原对象
  // TODO: 实现安全赋值
  return todo("set");
}

export function getType(value) {
  // 推导链:
  // 1) 通过 Object.prototype.toString.call 获取精确类型
  // 2) 截取并转小写
  // TODO: 实现精确类型判断
  return todo("getType");
}

export function flat(arr, depth = 1) {
  // 推导链:
  // 1) depth <= 0 时返回浅拷贝
  // 2) 遍历数组，遇到子数组递归展开
  // TODO: 实现数组扁平化
  return todo("flat");
}

export function flattenObj(
  obj,
  prefix = "",
  depth = Infinity,
  currentDepth = 0
) {
  // 推导链:
  // 1) 递归拼接 key: a.b / a[0]
  // 2) 到达非对象或深度上限时写入结果
  // TODO: 实现对象扁平化
  return todo("flattenObj");
}

export function uniqueBasic(arr) {
  // 推导链:
  // 1) 基本类型去重可用 Set
  // TODO: 实现基础去重
  return todo("uniqueBasic");
}

export function uniqueBy(arr, key) {
  // 推导链:
  // 1) 为每项计算唯一标识（函数或字段名）
  // 2) 使用 Map/Set 记录已出现标识
  // TODO: 实现对象数组按 key 去重
  return todo("uniqueBy");
}

export function myMap(arr, callback, thisArg) {
  // 推导链:
  // 1) 遍历数组并调用 callback(item, index, arr)
  // 2) 处理稀疏数组空洞
  // TODO: 手写 map
  return todo("myMap");
}

export function myFilter(arr, callback, thisArg) {
  // 推导链:
  // 1) 遍历并根据 callback 返回值决定保留
  // 2) 处理稀疏数组
  // TODO: 手写 filter
  return todo("myFilter");
}

export function myReduce(arr, callback, initialValue) {
  // 推导链:
  // 1) 处理有/无初始值两种起始逻辑
  // 2) 跳过数组空洞，逐步累计 acc
  // TODO: 手写 reduce
  return todo("myReduce");
}

export function pick(obj, keys) {
  // 推导链:
  // 1) 将 keys 统一成集合
  // 2) 仅拷贝命中的键
  // TODO: 实现 pick
  return todo("pick");
}

export function omit(obj, keys) {
  // 推导链:
  // 1) 将 keys 统一成集合
  // 2) 拷贝未命中的键
  // TODO: 实现 omit
  return todo("omit");
}

export function reactiveArray(arr, onChange) {
  // 推导链:
  // 1) Proxy 拦截变更方法(push/splice...)
  // 2) 拦截 set/delete 并回调变更信息
  // TODO: 实现响应式数组代理
  return todo("reactiveArray");
}

