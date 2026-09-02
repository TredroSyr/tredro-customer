import { useAuthStore } from "@/module/auth/store/auth-store";
import axios, { InternalAxiosRequestConfig } from "axios";

// Not called by any module's api/index.ts yet — every feature is mock-only
// for now (see lib/mock.ts). Kept in stripped form so swapping a module's
// mock functions for real requests later is a small, local change instead
// of building this plumbing from scratch. No refresh-token flow here: this
// prototype issues a single long-lived mock token, no JWT expiry/rotation.
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

// A GET that fails at the transport level (timeout, no response at all) is
// safe to replay once automatically instead of surfacing a cold-launch
// hiccup as a hard error.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retriedAfterNetworkError?: boolean })
      | undefined;

    const isTransportFailure = !error.response;
    const isGet = (originalRequest?.method ?? "get").toLowerCase() === "get";

    if (
      originalRequest &&
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
