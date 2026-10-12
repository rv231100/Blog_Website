import { createContext, useContext, useEffect, useState } from "react";

import apiRequest from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  async function refreshUser() {
    try {
      const data = await apiRequest("/auth/me");
      setUser(data.user);
      return data.user;
    } catch (error) {
      setUser(null);

      if (error.status === 401) {
        return null;
      }

      throw error;
    }
  }

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const data = await apiRequest("/auth/me");
        if (active) setUser(data.user);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setCheckingAuth(false);
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, []);

  async function login(credentials) {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    setUser(data.user);
    return data.user;
  }

  async function register(details) {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });

    setUser(data.user);
    return data.user;
  }

  async function logout() {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        checkingAuth,
        login,
        register,
        logout,
        refreshUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
