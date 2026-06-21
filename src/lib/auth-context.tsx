"use client";

/**
 * StudyPilot AI — Auth Context
 * Provides authentication state and actions across the entire app.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, setTokens, clearTokens, getAccessToken, getRefreshToken } from "./api";
import type { User, AuthTokens } from "./api";

// ── Types ──────────────────────────────────────────────────────────────────
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: {
    email: string; password: string; name: string; role: string;
    gradeLevel?: string; examBoards?: string[]; school?: string;
    dateOfBirth?: string; parentEmail?: string;
  }) => Promise<{ ok: boolean; error?: string; requiresParentConsent?: boolean }>;
  logout: () => Promise<void>;
}

type AuthContextValue = AuthState & AuthActions;

function toErrorMessage(error: string | { code?: string; message?: string } | undefined, fallback: string): string | undefined {
  if (!error) return undefined;
  if (typeof error === "string") return error;
  return error.message ?? fallback;
}

// ── Context ────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

// ── Provider ───────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sp_user");
      const token = getAccessToken();
      if (stored && token) {
        setUser(JSON.parse(stored));
        setAccessToken(token);
      }
    } catch {
      clearTokens();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const storeSession = useCallback((u: User, tokens: AuthTokens) => {
    setUser(u);
    setAccessToken(tokens.accessToken);
    setTokens(tokens.accessToken, tokens.refreshToken);
    localStorage.setItem("sp_user", JSON.stringify(u));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    if (!res.success || !res.data) {
      return { ok: false, error: toErrorMessage(res.error, "Login failed. Check your credentials.") };
    }
    storeSession(res.data.user, res.data.tokens);
    return { ok: true };
  }, [storeSession]);

  const register = useCallback(async (data: Parameters<AuthActions["register"]>[0]) => {
    const res = await authApi.register(data);
    if (!res.success || !res.data) {
      return { ok: false, error: toErrorMessage(res.error, "Registration failed. Please try again.") };
    }
    storeSession(res.data.user, res.data.tokens);
    return { ok: true, requiresParentConsent: res.data.requiresParentConsent };
  }, [storeSession]);

  const logout = useCallback(async () => {
    const rt = getRefreshToken();
    if (rt) {
      try { await authApi.logout(rt); } catch { /* ignore */ }
    }
    setUser(null);
    setAccessToken(null);
    clearTokens();
  }, []);

  return (
    <AuthContext.Provider value={{
      user, accessToken, isAuthenticated: !!user, isLoading,
      login, register, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
