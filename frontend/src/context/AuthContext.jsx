import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/api"; // axios wrapper (optional)

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

  useEffect(() => {
    // attach token to api instance if present
    if (token) {
      api.setAuthToken(token);
    } else {
      api.clearAuthToken();
    }
  }, [token]);

  const login = async (email, password) => {
    // Replace with real API call:
    // const res = await api.auth.login({ email, password });
    // setToken(res.token); setUser(res.user);
    // For now, dummy:
    const fake = { id: Date.now().toString(), name: email.split("@")[0], email, role: "student" };
    setUser(fake);
    const fakeToken = "dummy-token-" + Date.now();
    setToken(fakeToken);
    localStorage.setItem("ch_user", JSON.stringify(fake));
    localStorage.setItem("ch_token", fakeToken);
    return fake;
  };

  const register = async (name, email, password, role = "student") => {
    // Replace with api.auth.register...
    const fake = { id: Date.now().toString(), name, email, role };
    setUser(fake);
    const fakeToken = "dummy-token-" + Date.now();
    setToken(fakeToken);
    localStorage.setItem("ch_user", JSON.stringify(fake));
    localStorage.setItem("ch_token", fakeToken);
    return fake;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ch_user");
    localStorage.removeItem("ch_token");
  };

  const value = useMemo(() => ({ user, token, login, register, logout, setUser, setToken }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
