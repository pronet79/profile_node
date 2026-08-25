import { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api.js';

/* Simple GET data hook with loading/error state. */
export function useApi(path, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(path);
      setData(res.data.data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, deps);

  return { data, loading, error, refetch: fetchData };
}
