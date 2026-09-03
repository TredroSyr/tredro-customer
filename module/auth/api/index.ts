import api from "@/lib/axios";
import {
  AuthApiResponse,
  RefreshTokenResponse,
  SignInPayload,
  SignUpPayload,
} from "../types";

export async function signUp(
  payload: SignUpPayload,
): Promise<AuthApiResponse> {
  const { data } = await api.post<AuthApiResponse>(
    "/auth/customer/signup",
    payload,
  );
  return data;
}

export async function signIn(
  payload: SignInPayload,
): Promise<AuthApiResponse> {
  const { data } = await api.post<AuthApiResponse>(
    "/auth/customer/signin",
    payload,
  );
  return data;
}

export async function refreshAccessToken(
  refresh: string,
): Promise<RefreshTokenResponse> {
  const { data } = await api.post<RefreshTokenResponse>(
    "/auth/token/refresh",
    { refresh },
  );
  return data;
}

export async function signOut(refresh: string | null): Promise<void> {
  await api.post("/auth/signout", { refresh });
}
