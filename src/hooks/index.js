import { useState, useEffect, useCallback, useRef } from "react";

export function useAsync(asyncFn, deps = []) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });
  const mountedRef = useRef(true);

  const execute = useCallback(async (...args) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await asyncFn(...args);
      if (mountedRef.current) {
        setState({ data, loading: false, error: null });
      }
      return data;
    } catch (err) {
      if (mountedRef.current) {
        setState((s) => ({ ...s, loading: false, error: err.message }));
      }
      throw err;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    execute();
    return () => {
      mountedRef.current = false;
    };
  }, [execute]);

  return { ...state, refetch: execute };
}

export function usePagination(fetchFn, initialParams = {}) {
  const [params, setParams] = useState({ page: 1, size: 12, ...initialParams });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  const abortRef = useRef(null);

  const fetch = useCallback(
    async (p = params) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);
      try {
        const res = await fetchFn(p, { signal: controller.signal });
        if (mountedRef.current && !controller.signal.aborted) {
          setData(res.data);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        if (mountedRef.current) setError(err.message);
      } finally {
        if (mountedRef.current && abortRef.current === controller) {
          setLoading(false);
        }
      }
    },
    [fetchFn, params],
  );

  useEffect(() => {
    mountedRef.current = true;
    fetch(params);
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, [params]);

  const setPage = (page) => setParams((p) => ({ ...p, page }));
  const setSize = (size) => setParams((p) => ({ ...p, size, page: 1 }));
  const updateParams = (newParams) =>
    setParams((p) => ({ ...p, ...newParams, page: 1 }));

  return {
    data,
    loading,
    error,
    params,
    setPage,
    setSize,
    updateParams,
    refetch: fetch,
  };
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  return { toasts, addToast };
}
