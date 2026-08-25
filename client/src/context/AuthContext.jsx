import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, setAuthToken } from '../services/api.js';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setAdmin(data.data);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.data?.token) setAuthToken(data.data.token);
    setAdmin(data.data.admin);
    return data.data.admin;
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    setAuthToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
