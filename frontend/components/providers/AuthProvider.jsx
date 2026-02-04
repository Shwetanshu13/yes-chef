"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getToken, setToken, clearToken, authFetch } from "@/lib/auth";

const AuthContext = createContext({
  user: null,
  loading: true,
  refresh: async () => {},
  login: (token, user) => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setUser(null);
        return;
      }
      const res = await authFetch("/api/auth/me");
      const json = await res.json();
      setUser(json.user);
    } catch (error) {
      console.error(error);
      setUser(null);
      clearToken();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleLogin = (token, userData) => {
    setToken(token);
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await authFetch("/api/auth/logout", { method: "POST" });
    } catch (_) {
      // Ignore logout errors
    }
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refresh: load,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
