import { describe, expect, it, vi } from "vitest";
import {
  LRUCache,
  TreeNode,
  arrayToTree,
  bfs,
  canFinish,
  dfsStack,
  hasPathSum,
  indentToTree,
  inorderIterative,
  mergeSort,
  pathSum,
  pathSumIII,
  pathsToTree,
  postorderIterative,
  preorderIterative,
  quickSort,
  treeToArray
} from "../../src/data-structures/core.js";

describe("data-structures core", () => {
  it("arrayToTree/treeToArray converts correctly", () => {
    const list = [
      { id: 1, pid: null, name: "A" },
      { id: 2, pid: 1, name: "B" },
      { id: 3, pid: 1, name: "C" }
    ];

    const tree = arrayToTree(list);
    expect(tree).toHaveLength(1);
    expect(tree[0].children.map((x) => x.id)).toEqual([2, 3]);

    const back = treeToArray(tree);
    expect(back).toEqual(
      expect.arrayContaining([
        { id: 1, pid: null, name: "A" },
        { id: 2, pid: 1, name: "B" },
        { id: 3, pid: 1, name: "C" }
      ])
    );
  });

  it("pathsToTree builds nested tree from path strings", () => {
    const tree = pathsToTree(["/src/components/Button", "/src/hooks/useX"]);
    expect(tree[0].name).toBe("src");
    expect(tree[0].children.map((x) => x.name)).toEqual(["components", "hooks"]);
  });

  it("indentToTree builds tree by indentation", () => {
    const tree = indentToTree(["A", "  B", "  C", "    D"]);
    expect(tree[0].name).toBe("A");
    expect(tree[0].children[1].children[0].name).toBe("D");
  });

  it("binary tree traversals work", () => {
    const root = new TreeNode(
      1,
      new TreeNode(2, new TreeNode(4), new TreeNode(5)),
      new TreeNode(3)
    );

    expect(preorderIterative(root)).toEqual([1, 2, 4, 5, 3]);
    expect(inorderIterative(root)).toEqual([4, 2, 5, 1, 3]);
    expect(postorderIterative(root)).toEqual([4, 5, 2, 3, 1]);
  });

  it("dfsStack and bfs traverse generic tree in expected order", () => {
    const root = {
      name: "A",
      children: [{ name: "B", children: [{ name: "D", children: [] }] }, { name: "C", children: [] }]
    };
    const dfs = [];
    const bfsOrder = [];
    dfsStack(root, (n) => dfs.push(n.name));
    bfs(root, (n) => bfsOrder.push(n.name));

    expect(dfs).toEqual(["A", "B", "D", "C"]);
    expect(bfsOrder).toEqual(["A", "B", "C", "D"]);
  });

  it("LRUCache evicts least recently used key", () => {
    const lru = new LRUCache(2);
    lru.put(1, 1);
    lru.put(2, 2);
    expect(lru.get(1)).toBe(1);
    lru.put(3, 3);
    expect(lru.get(2)).toBe(-1);
    expect(lru.get(3)).toBe(3);
  });

  it("quickSort/mergeSort sort numbers", () => {
    const nums = [5, 1, 4, 2, 3];
    expect(quickSort(nums)).toEqual([1, 2, 3, 4, 5]);
    expect(mergeSort(nums)).toEqual([1, 2, 3, 4, 5]);
    expect(nums).toEqual([5, 1, 4, 2, 3]);
  });

  it("canFinish checks DAG cycle", () => {
    expect(
      canFinish(2, [
        [1, 0]
      ])
    ).toBe(true);
    expect(
      canFinish(2, [
        [1, 0],
        [0, 1]
      ])
    ).toBe(false);
  });

  it("path sum helpers work", () => {
    const root = new TreeNode(
      5,
      new TreeNode(4, new TreeNode(11, new TreeNode(7), new TreeNode(2))),
      new TreeNode(8, new TreeNode(13), new TreeNode(4, null, new TreeNode(1)))
    );

    expect(hasPathSum(root, 22)).toBe(true);
    expect(pathSum(root, 22)).toEqual([[5, 4, 11, 2]]);
    expect(pathSumIII(root, 22)).toBe(2);
  });
});
