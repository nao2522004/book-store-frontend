import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, setAuthFailureHandler } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch (_) { }
    localStorage.removeItem('accessToken');
    setUser(null);
  }, []);

  // Đăng ký callback: khi api/index.js phát hiện refresh thất bại
  // → tự động logout UI mà không cần user làm gì
  useEffect(() => {
    setAuthFailureHandler(() => {
      localStorage.removeItem('accessToken');
      setUser(null);
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      authAPI.me()
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('accessToken'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    const me = await authAPI.me();
    setUser(me.data);
    return res.data;
  }, []);

  const register = useCallback(async (data) => {
    return authAPI.register(data);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);