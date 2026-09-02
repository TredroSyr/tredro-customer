"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "../store/auth-store";
import { login, register, MockApiError } from "../api";
import { LoginCredentials, RegisterPayload } from "../types";

interface MutationCallbacks {
  onError?: (error: MockApiError) => void;
}

export function useLoginMutation(callbacks?: MutationCallbacks) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.tokens);
      toast.success(response.message);
      router.replace("/home");
    },
    onError: (error: MockApiError) => {
      callbacks?.onError?.(error);
    },
  });
}

export function useRegisterMutation(callbacks?: MutationCallbacks) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.tokens);
      toast.success(response.message);
      router.replace("/home");
    },
    onError: (error: MockApiError) => {
      callbacks?.onError?.(error);
    },
  });
}
