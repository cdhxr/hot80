import { useCallback, useEffect, useRef, useState } from "react";

export function useDebounceValue(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useDebounceFn(fn, delay, options = {}) {
  const timerRef = useRef();
  const fnRef = useRef(fn);
  const leading = options.leading ?? false;

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => () => timerRef.current && clearTimeout(timerRef.current), []);

  return useCallback(
    (...args) => {
      const callNow = leading && !timerRef.current;
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        timerRef.current = undefined;
        if (!leading) fnRef.current(...args);
      }, delay);

      if (callNow) fnRef.current(...args);
    },
    [delay, leading]
  );
}

export function useThrottleFn(fn, delay, options = {}) {
  const timerRef = useRef();
  const fnRef = useRef(fn);
  const lastTimeRef = useRef(0);
  const trailing = options.trailing ?? true;

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => () => timerRef.current && clearTimeout(timerRef.current), []);

  return useCallback(
    (...args) => {
      const now = Date.now();
      const remain = delay - (now - lastTimeRef.current);

      if (remain <= 0) {
        lastTimeRef.current = now;
        fnRef.current(...args);
        return;
      }

      if (trailing && !timerRef.current) {
        timerRef.current = setTimeout(() => {
          lastTimeRef.current = Date.now();
          timerRef.current = undefined;
          fnRef.current(...args);
        }, remain);
      }
    },
    [delay, trailing]
  );
}

export function useUpdateEffect(effect, deps = []) {
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return undefined;
    }
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function usePrevious(value, initialValue) {
  const ref = useRef(initialValue);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export function useRequest(serviceFn, options = {}) {
  const {
    manual = false,
    defaultParams = [],
    debounceWait = 0,
    pollingInterval = 0,
    onSuccess,
    onError
  } = options;

  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const paramsRef = useRef(defaultParams);
  const timerRef = useRef();
  const pollerRef = useRef();
  const requestIdRef = useRef(0);
  const mountedRef = useRef(true);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (pollerRef.current) clearInterval(pollerRef.current);
    timerRef.current = undefined;
    pollerRef.current = undefined;
  }, []);

  useEffect(
    () => () => {
      mountedRef.current = false;
      clearTimers();
      requestIdRef.current += 1;
    },
    [clearTimers]
  );

  const exec = useCallback(
    async (...args) => {
      paramsRef.current = args;
      const id = ++requestIdRef.current;
      if (mountedRef.current) {
        setLoading(true);
        setError(undefined);
      }

      try {
        const result = await serviceFn(...args);
        if (!mountedRef.current || id !== requestIdRef.current) return result;
        setData(result);
        onSuccess?.(result);
        return result;
      } catch (err) {
        if (!mountedRef.current || id !== requestIdRef.current) throw err;
        const cast = err instanceof Error ? err : new Error(String(err));
        setError(cast);
        onError?.(cast);
        throw cast;
      } finally {
        if (mountedRef.current && id === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [onError, onSuccess, serviceFn]
  );

  const run = useCallback(
    (...args) => {
      if (debounceWait > 0) {
        if (timerRef.current) clearTimeout(timerRef.current);
        return new Promise((resolve, reject) => {
          timerRef.current = setTimeout(() => {
            exec(...args).then(resolve, reject);
          }, debounceWait);
        });
      }
      return exec(...args);
    },
    [debounceWait, exec]
  );

  const refresh = useCallback(() => run(...(paramsRef.current || [])), [run]);

  const cancel = useCallback(() => {
    requestIdRef.current += 1;
    clearTimers();
    setLoading(false);
  }, [clearTimers]);

  useEffect(() => {
    if (!manual) run(...defaultParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manual]);

  useEffect(() => {
    if (pollingInterval > 0) {
      pollerRef.current = setInterval(() => {
        refresh().catch(() => {});
      }, pollingInterval);
      return () => pollerRef.current && clearInterval(pollerRef.current);
    }
    return undefined;
  }, [pollingInterval, refresh]);

  return { data, error, loading, run, refresh, cancel };
}
