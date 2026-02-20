function cloneNode(item) {
  return { ...item, children: [] };
}

export function arrayToTree(arr, rootId = null) {
  const map = new Map();
  const result = [];

  arr.forEach((item) => map.set(item.id, cloneNode(item)));

  arr.forEach((item) => {
    const node = map.get(item.id);
    if (item.pid === rootId) {
      result.push(node);
      return;
    }
    const parent = map.get(item.pid);
    if (parent) parent.children.push(node);
  });

  return result;
}

export function treeToArray(tree, pid = null, result = []) {
  for (const node of tree) {
    const { children = [], ...rest } = node;
    result.push({ ...rest, pid });
    if (children.length) treeToArray(children, node.id, result);
  }
  return result;
}

export function pathsToTree(paths) {
  const root = { name: "root", children: [] };
  const map = new Map([["", root]]);

  for (const path of paths) {
    const parts = path.split("/").filter(Boolean);
    let currPath = "";

    for (const part of parts) {
      currPath += `/${part}`;
      if (!map.has(currPath)) {
        const node = { name: part, children: [] };
        map.set(currPath, node);
        const parentPath = currPath.slice(0, currPath.lastIndexOf("/"));
        map.get(parentPath).children.push(node);
      }
    }
  }

  return root.children;
}

export function indentToTree(lines, indentSize = 2) {
  const root = { name: "root", children: [] };
  const levelMap = new Map([[-1, root]]);

  for (const line of lines) {
    const match = line.match(/^(\s*)(.*)$/);
    if (!match) continue;

    const level = match[1].length / indentSize;
    const name = match[2].trim();
    if (!name) continue;

    const node = { name, children: [] };
    const parent = levelMap.get(level - 1);
    if (!parent) continue;
    parent.children.push(node);
    levelMap.set(level, node);
  }

  return root.children;
}

export function preorderIterative(root) {
  if (!root) return [];
  const result = [];
  const stack = [root];

  while (stack.length) {
    const node = stack.pop();
    result.push(node.val);
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }

  return result;
}

export function inorderIterative(root) {
  const result = [];
  const stack = [];
  let current = root;

  while (current || stack.length) {
    while (current) {
      stack.push(current);
      current = current.left;
    }
    current = stack.pop();
    result.push(current.val);
    current = current.right;
  }

  return result;
}

export function postorderIterative(root) {
  if (!root) return [];
  const result = [];
  const stack = [root];

  while (stack.length) {
    const node = stack.pop();
    result.unshift(node.val);
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }

  return result;
}

export function dfsRecursive(node, callback) {
  if (!node) return;
  callback(node);
  (node.children || []).forEach((child) => dfsRecursive(child, callback));
}

export function dfsStack(root, callback) {
  if (!root) return;
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    callback(node);
    const children = node.children || [];
    for (let i = children.length - 1; i >= 0; i -= 1) {
      stack.push(children[i]);
    }
  }
}

export function bfs(root, callback) {
  if (!root) return;
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    callback(node);
    queue.push(...(node.children || []));
  }
}

export class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const firstKey = this.map.keys().next().value;
      this.map.delete(firstKey);
    }
  }
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left - 1;
  for (let j = left; j < right; j += 1) {
    if (arr[j] <= pivot) {
      i += 1;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}

function quickSortInPlace(arr, left, right) {
  if (left >= right) return;
  const pivotIndex = partition(arr, left, right);
  quickSortInPlace(arr, left, pivotIndex - 1);
  quickSortInPlace(arr, pivotIndex + 1, right);
}

export function quickSort(arr) {
  const copied = arr.slice();
  quickSortInPlace(copied, 0, copied.length - 1);
  return copied;
}

function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i), right.slice(j));
}

export function mergeSort(arr) {
  if (arr.length <= 1) return arr.slice();
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

export function canFinish(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => []);
  const inDegree = Array(numCourses).fill(0);

  for (const [course, pre] of prerequisites) {
    graph[pre].push(course);
    inDegree[course] += 1;
  }

  const queue = [];
  for (let i = 0; i < numCourses; i += 1) {
    if (inDegree[i] === 0) queue.push(i);
  }

  let visited = 0;
  while (queue.length) {
    const current = queue.shift();
    visited += 1;
    for (const next of graph[current]) {
      inDegree[next] -= 1;
      if (inDegree[next] === 0) queue.push(next);
    }
  }

  return visited === numCourses;
}

export class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

export function hasPathSum(root, target) {
  if (!root) return false;
  const remain = target - root.val;
  if (!root.left && !root.right) return remain === 0;
  return hasPathSum(root.left, remain) || hasPathSum(root.right, remain);
}

export function pathSum(root, target) {
  const result = [];

  function dfs(node, remain, path) {
    if (!node) return;
    const nextPath = [...path, node.val];
    const nextRemain = remain - node.val;
    if (!node.left && !node.right && nextRemain === 0) {
      result.push(nextPath);
      return;
    }
    dfs(node.left, nextRemain, nextPath);
    dfs(node.right, nextRemain, nextPath);
  }

  dfs(root, target, []);
  return result;
}

export function pathSumIII(root, target) {
  function countFromNode(node, remain) {
    if (!node) return 0;
    const matched = node.val === remain ? 1 : 0;
    return (
      matched +
      countFromNode(node.left, remain - node.val) +
      countFromNode(node.right, remain - node.val)
    );
  }

  if (!root) return 0;
  return (
    countFromNode(root, target) +
    pathSumIII(root.left, target) +
    pathSumIII(root.right, target)
  );
}
