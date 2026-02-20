function todo(name) {
  throw new Error(`TODO: ${name}`);
}

function cloneNode(item) {
  // TODO: 返回一个包含 children 空数组的浅拷贝节点
  return todo("cloneNode");
}

export function arrayToTree(arr, rootId = null) {
  // 推导链:
  // 1) 先建 id -> node 的 Map
  // 2) 再遍历一次连接父子关系
  // 3) pid === rootId 的放入根结果
  // TODO: 实现数组转树
  void arr;
  void rootId;
  return todo("arrayToTree");
}

export function treeToArray(tree, pid = null, result = []) {
  // 推导链:
  // 1) DFS 遍历树
  // 2) 写入当前节点并携带 pid
  // 3) 递归 children
  // TODO: 实现树转数组
  void tree;
  void pid;
  void result;
  return todo("treeToArray");
}

export function pathsToTree(paths) {
  // 推导链:
  // 1) 路径按 / 切分
  // 2) 用 Map 避免重复节点
  // 3) 逐层挂到父节点 children
  // TODO: 实现路径字符串转树
  void paths;
  return todo("pathsToTree");
}

export function indentToTree(lines, indentSize = 2) {
  // 推导链:
  // 1) 用前导空格数计算层级
  // 2) levelMap 记录每层最后一个节点
  // 3) 把当前节点挂到 level-1 的父节点
  // TODO: 实现缩进文本转树
  void lines;
  void indentSize;
  return todo("indentToTree");
}

export function preorderIterative(root) {
  // 推导链: 根 -> 左 -> 右，栈中先压右再压左
  // TODO: 实现二叉树前序迭代
  void root;
  return todo("preorderIterative");
}

export function inorderIterative(root) {
  // 推导链: 一路向左入栈，弹出后处理，再转右子树
  // TODO: 实现二叉树中序迭代
  void root;
  return todo("inorderIterative");
}

export function postorderIterative(root) {
  // 推导链: 根右左收集后 reverse 得到左右根
  // TODO: 实现二叉树后序迭代
  void root;
  return todo("postorderIterative");
}

export function dfsRecursive(node, callback) {
  // 推导链: 先访问当前节点，再递归 children
  // TODO: 实现 DFS 递归
  void node;
  void callback;
  return todo("dfsRecursive");
}

export function dfsStack(root, callback) {
  // 推导链: 栈模拟 DFS，children 倒序入栈保证遍历顺序
  // TODO: 实现 DFS 栈版
  void root;
  void callback;
  return todo("dfsStack");
}

export function bfs(root, callback) {
  // 推导链: 队列层序遍历，出队后把 children 依次入队
  // TODO: 实现 BFS
  void root;
  void callback;
  return todo("bfs");
}

export class LRUCache {
  constructor(capacity) {
    // 推导链:
    // 1) Map 存 key/value
    // 2) delete + set 表示“最近使用”
    // TODO: 初始化 LRU 结构
    void capacity;
    todo("LRUCache.constructor");
  }

  get(key) {
    // 推导链:
    // 1) 不存在返回 -1
    // 2) 命中后移动到最新位置并返回值
    // TODO: 实现 get
    void key;
    return todo("LRUCache.get");
  }

  put(key, value) {
    // 推导链:
    // 1) 已存在先删再插入
    // 2) 超容量时删掉 Map 第一个 key
    // TODO: 实现 put
    void key;
    void value;
    return todo("LRUCache.put");
  }
}

function partition(arr, left, right) {
  // TODO: 以 pivot 划分区间并返回 pivot 最终索引
  void arr;
  void left;
  void right;
  return todo("partition");
}

function quickSortInPlace(arr, left, right) {
  // TODO: 递归原地快排
  void arr;
  void left;
  void right;
  return todo("quickSortInPlace");
}

export function quickSort(arr) {
  // 推导链:
  // 1) 复制输入，避免修改原数组
  // 2) 原地快排副本后返回
  // TODO: 实现 quickSort
  void arr;
  return todo("quickSort");
}

function merge(left, right) {
  // TODO: 合并两个有序数组
  void left;
  void right;
  return todo("merge");
}

export function mergeSort(arr) {
  // 推导链:
  // 1) 分治到长度 <= 1
  // 2) 递归排序左右
  // 3) merge 合并
  // TODO: 实现 mergeSort
  void arr;
  return todo("mergeSort");
}

export function canFinish(numCourses, prerequisites) {
  // 推导链:
  // 1) 建邻接表和入度表
  // 2) 入度 0 入队做拓扑排序
  // 3) 处理节点数 === 课程数则无环
  // TODO: 实现课程表可完成判断
  void numCourses;
  void prerequisites;
  return todo("canFinish");
}

export class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

export function hasPathSum(root, target) {
  // 推导链:
  // 1) 递归减去当前节点值
  // 2) 到叶子节点时判断剩余值是否为 0
  // TODO: 实现路径总和 I
  void root;
  void target;
  return todo("hasPathSum");
}

export function pathSum(root, target) {
  // 推导链:
  // 1) DFS + path 数组
  // 2) 叶子且和命中时收集路径
  // 3) 回溯继续搜索
  // TODO: 实现路径总和 II
  void root;
  void target;
  return todo("pathSum");
}

export function pathSumIII(root, target) {
  // 推导链:
  // 1) countFromNode 统计“从当前节点出发”的路径数
  // 2) 总数 = 当前 + 左子树 + 右子树
  // TODO: 实现路径总和 III
  void root;
  void target;
  return todo("pathSumIII");
}
