import { useAuthStore } from "@/module/auth/store/auth-store";
import axios, { InternalAxiosRequestConfig } from "axios";

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
  (response) => response,
  async (error) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retriedAfter401?: boolean;
          _retriedAfterNetworkError?: boolean;
        })
      | undefined;

    if (!originalRequest) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retriedAfter401) {
      originalRequest._retriedAfter401 = true;
      const access = await refreshAccessToken();
      if (access) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      }
      return Promise.reject(error);
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

    return Promise.reject(error);
  },
);

export default api;
