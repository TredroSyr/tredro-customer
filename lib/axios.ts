import { useAuthStore } from "@/module/auth/store/auth-store";
import { playActionErrorSound, playActionSuccessSound } from "@/lib/action-sound";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Methods that represent a user-initiated create/update/delete action.
// Only these get a success/fail sound — GET requests (page loads, polling,
// react-query refetches, and the auto-retry-on-network-error below) fire far
// too often to play a sound for.
const MUTATING_METHODS = ["post", "put", "patch", "delete"];

// Endpoints that are technically mutating but happen passively/in the
// background (e.g. marking a notification read as soon as it's opened) —
// not a deliberate user action, so they shouldn't get a sound either.
const SILENT_URL_PATTERNS = [/notifications\/.*read/i];

const isMutatingRequest = (method?: string) =>
  !!method && MUTATING_METHODS.includes(method.toLowerCase());

const shouldPlaySound = (method?: string, url?: string) =>
  isMutatingRequest(method) &&
  !SILENT_URL_PATTERNS.some((pattern) => pattern.test(url ?? ""));

// Rejects with `error`, playing the action-fail sound first if the request
// that caused it was a create/update/delete call. Use this instead of a bare
// `Promise.reject(error)` for every *final* rejection below (i.e. not for
// the retried request itself — that retry gets its own success/error outcome
// through this same interceptor).
const rejectWithSound = (error: AxiosError) => {
  if (shouldPlaySound(error.config?.method, error.config?.url)) {
    playActionErrorSound();
  }
  return Promise.reject(error);
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh-token rotation is disabled server-side, so a bare access token can
// be swapped in on the same refresh token. A single retry per request keeps
// us from looping if the refresh token itself is dead.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/token/refresh`,
        { refresh: refreshToken },
        { headers: { Accept: "application/json" } },
      )
      .then((response) => {
        const access = response.data?.data?.access as string | undefined;
        if (!access) return null;
        useAuthStore.getState().setAccessToken(access);
        return access;
      })
      .catch(() => {
        useAuthStore.getState().clearAuth();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.response.use(
  (response) => {
    if (shouldPlaySound(response.config.method, response.config.url)) {
      playActionSuccessSound();
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retriedAfter401?: boolean;
          _retriedAfterNetworkError?: boolean;
        })
      | undefined;

    if (!originalRequest) return rejectWithSound(error);

    if (error.response?.status === 401 && !originalRequest._retriedAfter401) {
      originalRequest._retriedAfter401 = true;
      const access = await refreshAccessToken();
      if (access) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      }
      return rejectWithSound(error);
    }

    // A GET that fails at the transport level (timeout, no response at all)
    // is safe to replay once automatically instead of surfacing a cold-launch
    // hiccup as a hard error.
    const isTransportFailure = !error.response;
    const isGet = (originalRequest.method ?? "get").toLowerCase() === "get";

    if (
      isTransportFailure &&
      isGet &&
      !originalRequest._retriedAfterNetworkError
    ) {
      originalRequest._retriedAfterNetworkError = true;
      return api(originalRequest);
    }

    return rejectWithSound(error);
  },
);

export default api;
