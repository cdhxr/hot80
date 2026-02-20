function isObjectLike(value) {
  return value !== null && typeof value === "object";
}

function parsePath(path) {
  if (Array.isArray(path)) return path.map(String);
  return String(path)
    .replace(/\[(.+?)\]/g, ".$1")
    .split(".")
    .filter((key) => key !== "");
}

export function deepClone(obj, hash = new WeakMap()) {
  if (!isObjectLike(obj)) return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (hash.has(obj)) return hash.get(obj);

  if (obj instanceof Map) {
    const result = new Map();
    hash.set(obj, result);
    obj.forEach((value, key) => result.set(key, deepClone(value, hash)));
    return result;
  }

  if (obj instanceof Set) {
    const result = new Set();
    hash.set(obj, result);
    obj.forEach((value) => result.add(deepClone(value, hash)));
    return result;
  }

  const result = Array.isArray(obj)
    ? []
    : Object.create(Object.getPrototypeOf(obj));
  hash.set(obj, result);

  Reflect.ownKeys(obj).forEach((key) => {
    result[key] = deepClone(obj[key], hash);
  });

  return result;
}

export function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (!isObjectLike(a) || !isObjectLike(b)) return false;

  const typeA = Object.prototype.toString.call(a);
  const typeB = Object.prototype.toString.call(b);
  if (typeA !== typeB) return false;

  if (a instanceof Date) return a.getTime() === b.getTime();
  if (a instanceof RegExp) return a.toString() === b.toString();

  if (a instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [key, value] of a.entries()) {
      if (!b.has(key) || !deepEqual(value, b.get(key))) return false;
    }
    return true;
  }

  if (a instanceof Set) {
    if (a.size !== b.size) return false;
    for (const value of a.values()) {
      if (!b.has(value)) return false;
    }
    return true;
  }

  const keysA = Reflect.ownKeys(a);
  const keysB = Reflect.ownKeys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}

export function get(obj, path, defaultValue) {
  const keys = parsePath(path);
  let current = obj;

  for (const key of keys) {
    if (current == null) return defaultValue;
    current = current[key];
  }

  return current === undefined ? defaultValue : current;
}

export function set(obj, path, value) {
  const keys = parsePath(path);
  if (keys.length === 0) return obj;

  let current = obj;
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const isLast = i === keys.length - 1;
    if (isLast) {
      current[key] = value;
      break;
    }

    if (!isObjectLike(current[key])) {
      const nextKey = keys[i + 1];
      current[key] = /^\d+$/.test(nextKey) ? [] : {};
    }
    current = current[key];
  }

  return obj;
}

export function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

export function flat(arr, depth = 1) {
  if (depth < 1) return arr.slice();
  const result = [];

  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flat(item, depth - 1));
    } else {
      result.push(item);
    }
  }
  return result;
}

export function flattenObj(
  obj,
  prefix = "",
  depth = Infinity,
  currentDepth = 0
) {
  if (!isObjectLike(obj) || currentDepth >= depth) {
    return prefix ? { [prefix]: obj } : {};
  }

  if (Array.isArray(obj)) {
    return obj.reduce((acc, item, index) => {
      const newKey = prefix ? `${prefix}[${index}]` : `[${index}]`;
      Object.assign(acc, flattenObj(item, newKey, depth, currentDepth + 1));
      return acc;
    }, {});
  }

  return Object.keys(obj).reduce((acc, key) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    Object.assign(acc, flattenObj(obj[key], newKey, depth, currentDepth + 1));
    return acc;
  }, {});
}

export function uniqueBasic(arr) {
  return [...new Set(arr)];
}

export function uniqueBy(arr, key) {
  const seen = new Map();
  return arr.filter((item) => {
    const k = typeof key === "function" ? key(item) : item[key];
    if (seen.has(k)) return false;
    seen.set(k, true);
    return true;
  });
}

export function myMap(arr, callback, thisArg) {
  const result = new Array(arr.length);
  for (let i = 0; i < arr.length; i += 1) {
    if (!(i in arr)) continue;
    result[i] = callback.call(thisArg, arr[i], i, arr);
  }
  return result;
}

export function myFilter(arr, callback, thisArg) {
  const result = [];
  for (let i = 0; i < arr.length; i += 1) {
    if (!(i in arr)) continue;
    if (callback.call(thisArg, arr[i], i, arr)) result.push(arr[i]);
  }
  return result;
}

export function myReduce(arr, callback, initialValue) {
  let i = 0;
  let accumulator = initialValue;

  if (arguments.length < 3) {
    while (i < arr.length && !(i in arr)) i += 1;
    if (i >= arr.length) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    accumulator = arr[i];
    i += 1;
  }

  for (; i < arr.length; i += 1) {
    if (!(i in arr)) continue;
    accumulator = callback(accumulator, arr[i], i, arr);
  }
  return accumulator;
}

export function pick(obj, keys) {
  const keySet = new Set(Array.isArray(keys) ? keys : [keys]);
  return Object.keys(obj).reduce((result, key) => {
    if (keySet.has(key)) result[key] = obj[key];
    return result;
  }, {});
}

export function omit(obj, keys) {
  const keySet = new Set(Array.isArray(keys) ? keys : [keys]);
  return Object.keys(obj).reduce((result, key) => {
    if (!keySet.has(key)) result[key] = obj[key];
    return result;
  }, {});
}

export function reactiveArray(arr, onChange) {
  const methods = new Set([
    "push",
    "pop",
    "shift",
    "unshift",
    "splice",
    "sort",
    "reverse"
  ]);

  return new Proxy(arr, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver);
      if (typeof value === "function" && methods.has(String(key))) {
        return (...args) => {
          const oldValue = target.slice();
          const result = Reflect.apply(value, target, args);
          onChange?.({
            type: "method",
            method: key,
            args,
            oldValue,
            newValue: target.slice()
          });
          return result;
        };
      }
      return value;
    },

    set(target, key, value, receiver) {
      const oldValue = target[key];
      const result = Reflect.set(target, key, value, receiver);
      onChange?.({ type: "set", key, oldValue, newValue: value });
      return result;
    },

    deleteProperty(target, key) {
      const oldValue = target[key];
      const result = Reflect.deleteProperty(target, key);
      onChange?.({ type: "delete", key, oldValue });
      return result;
    }
  });
}
