import { useState, useEffect, useCallback } from 'react';

export function useAsync(asyncFn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const execute = useCallback(async (...args) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await asyncFn(...args);
      setState({ data, loading: false, error: null });
      return data;
    } catch (err) {
      setState(s => ({ ...s, loading: false, error: err.message }));
      throw err;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { execute(); }, [execute]);

  return { ...state, refetch: execute };
}

export function usePagination(fetchFn, initialParams = {}) {
  const [params, setParams] = useState({ page: 0, size: 12, ...initialParams });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (p = params) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFn(p);
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, params]);

  useEffect(() => { fetch(params); }, [params]);

  const setPage = (page) => setParams(p => ({ ...p, page }));
  const setSize = (size) => setParams(p => ({ ...p, size, page: 0 }));
  const updateParams = (newParams) => setParams(p => ({ ...p, ...newParams, page: 0 }));

  return { data, loading, error, params, setPage, setSize, updateParams, refetch: fetch };
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

  return { toasts, addToast };
}
