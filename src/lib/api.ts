/**
 * StudyPilot AI — Centralized API Client
 * Talks to the Express backend (port 4000) via the Next.js proxy layer (/api/*)
 * Automatically attaches JWT, handles 401 token refresh, and retries once.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

// ── Token storage helpers ──────────────────────────────────────────────────
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sp_access_token");
}
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sp_refresh_token");
}
export function setTokens(access: string, refresh: string) {
  localStorage.setItem("sp_access_token", access);
  localStorage.setItem("sp_refresh_token", refresh);
}
export function clearTokens() {
  localStorage.removeItem("sp_access_token");
  localStorage.removeItem("sp_refresh_token");
  localStorage.removeItem("sp_user");
}

// ── Token refresh ──────────────────────────────────────────────────────────
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const rt = getRefreshToken();
  if (!rt) return null;

  if (refreshPromise) return refreshPromise;

  refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: rt }),
  })
    .then(async (res) => {
      if (!res.ok) { clearTokens(); return null; }
      const json = await res.json();
      const { accessToken, refreshToken } = json.data?.tokens ?? {};
      if (accessToken && refreshToken) {
        setTokens(accessToken, refreshToken);
        return accessToken;
      }
      clearTokens();
      return null;
    })
    .finally(() => { refreshPromise = null; });

  return refreshPromise;
}

// ── Core fetch wrapper ─────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string | { code?: string; message?: string };
}

function extractErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const maybeError = payload as { message?: string; error?: { message?: string } | string };
  if (typeof maybeError.error === "string") return maybeError.error;
  if (maybeError.error && typeof maybeError.error === "object" && maybeError.error.message) {
    return maybeError.error.message;
  }
  if (maybeError.message) return maybeError.message;
  return fallback;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<ApiResponse<T>> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // 401 → try refresh once
  if (res.status === 401 && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      const retried = await fetch(`${BASE_URL}${path}`, { ...options, headers });
      if (!retried.ok) {
        const err = await retried.json().catch(() => ({}));
        return { success: false, error: extractErrorMessage(err, "Request failed") };
      }
      return retried.json() as Promise<ApiResponse<T>>;
    }
    // Token refresh failed — user needs to log in again
    clearTokens();
    if (typeof window !== "undefined") window.location.href = "/auth";
    return { success: false, error: "Session expired. Please log in again." };
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { success: false, error: extractErrorMessage(err, `Error ${res.status}`) };
  }

  return res.json() as Promise<ApiResponse<T>>;
}

// ── Convenience helpers ────────────────────────────────────────────────────
export const api = {
  get: <T>(path: string) => apiFetch<T>(path, { method: "GET" }),
  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};

// ── Auth API ───────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  role: "STUDENT" | "PARENT" | "TEACHER" | "ADMIN";
  plan?: "free" | "pro" | "school";
  gradeLevel?: string;
}

export interface AuthTokens { accessToken: string; refreshToken: string; }

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ user: User; tokens: AuthTokens }>("/auth/login", { email, password }),

  register: (body: {
    email: string; password: string; name: string; role: string;
    gradeLevel?: string; examBoards?: string[]; school?: string;
    dateOfBirth?: string; parentEmail?: string;
  }) => api.post<{ user: User; tokens: AuthTokens; requiresParentConsent?: boolean }>("/auth/register", body),

  logout: (refreshToken: string) =>
    api.post("/auth/logout", { refreshToken }),

  refresh: (refreshToken: string) =>
    api.post<{ tokens: AuthTokens }>("/auth/refresh", { refreshToken }),
};

// ── Student API ────────────────────────────────────────────────────────────
export const studentApi = {
  getProfile: () => api.get<{ student: unknown }>("/student/profile"),
  getDashboard: () => api.get<unknown>("/student/dashboard"),
};

// ── Tutor API ──────────────────────────────────────────────────────────────
export const tutorApi = {
  ask: (subject: string, topic: string, question: string, depth: string) =>
    api.post<{ reply: string; hints?: string[] }>("/tutor/ask", { subject, topic, question, depth }),
};

// ── Homework API ───────────────────────────────────────────
export interface HomeworkSession {
  id: string;
  questionText: string;
  hintsGiven: number;
  resolved: boolean;
  studentId: string;
}

export interface HomeworkHint {
  hintLevel: number;
  hint: string;
  isFinalStage: boolean;
  similarPracticeQuestion?: string;
}

export const homeworkApi = {
  /** Start a new homework session for a question */
  start: (questionText: string, subjectId?: string) =>
    api.post<HomeworkSession>("/homework/start", { questionText, subjectId }),

  /** Get the next progressive hint for a session */
  hint: (sessionId: string, subject?: string, gradeLevel?: string) =>
    api.post<HomeworkHint>("/homework/hint", { sessionId, subject, gradeLevel }),

  /** Mark a homework session as resolved */
  resolve: (sessionId: string) =>
    api.post<{ resolved: boolean }>("/homework/resolve", { sessionId }),

  /** Legacy: simple single-call help (used by api.ts consumers who don't use session flow) */
  help: (question: string, subject?: string) =>
    api.post<{ breakdown: string; hints: string[]; practice: string }>("/homework/help", { question, subject }),
};

// ── Quiz API ───────────────────────────────────────────────────────────────
export const quizApi = {
  generate: (params: any) =>
    api.post<{ quizId: string; questions: any[] }>("/quiz/generate", params),
  answer: (quizId: string, questionId: string, studentAnswer: any, timeTakenSeconds?: number) =>
    api.post<{ isCorrect: boolean; explanation: string; correctAnswer: any }>("/quiz/answer", { quizId, questionId, studentAnswer, timeTakenSeconds }),
  finish: (quizId: string) =>
    api.post<{ xpAwarded: number; score: number; total: number }>("/quiz/finish", { quizId }),
  getRecent: () =>
    api.get<any[]>("/quiz/recent"),
  getMastery: () =>
    api.get<any[]>("/quiz/mastery"),
};

// ── Progress API ───────────────────────────────────────────────────────────
export const progressApi = {
  getSummary: () => api.get<unknown>("/progress/summary"),
};

// ── Payment API ────────────────────────────────────────────────────────────
export const paymentApi = {
  initialize: (plan: string, email: string) =>
    api.post<{ authorizationUrl: string; reference: string }>("/payment/initialize", { plan, email }),
  verify: (reference: string) =>
    api.post<{ status: string; plan: string }>("/payment/verify", { reference }),
};

export const apiClient = api;
