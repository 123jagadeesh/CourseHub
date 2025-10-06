import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ch_user")) || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("ch_token") || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) api.setAuthToken(token);
    else api.setAuthToken(null);
  }, [token]);

  const handleAuthSuccess = (data) => {
    
    const { token: t, ...userData } = data;
    setToken(t);
    setUser(userData);
    localStorage.setItem("ch_token", t);
    localStorage.setItem("ch_user", JSON.stringify(userData));
    api.setAuthToken(t);
  };

  const register = async (name, email, password, role = "student") => {
    setLoading(true);
    try {
      const res = await api.auth.register({ name, email, password, role });
      handleAuthSuccess(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      handleAuthSuccess(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ch_user");
    localStorage.removeItem("ch_token");
    api.setAuthToken(null);
  };

  
  useEffect(() => {
    const interceptor = api.instance.interceptors.response.use(
      (r) => r,
      (error) => {
        if (error.isUnauthorized) logout();
        return Promise.reject(error);
      }
    );
    return () => api.instance.interceptors.response.eject(interceptor);
  }, []);

  const value = useMemo(() => ({
    user, token, loading, login, register, logout
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
