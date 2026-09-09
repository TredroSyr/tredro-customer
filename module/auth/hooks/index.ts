"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { toast } from "@/components/ui/toast";
import { useAuthStore } from "../store/auth-store";
import { signUp, signIn, signOut } from "../api";
import { ApiErrorResponse, SignInPayload, SignUpPayload } from "../types";

interface MutationCallbacks {
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}

export function useLoginMutation(callbacks?: MutationCallbacks) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: SignInPayload) => signIn(payload),
    onSuccess: (response) => {
      setAuth(response.data.customer, response.data.tokens);
      toast.success(response.message);
      router.replace(
        response.data.customer.onboarding_completed
          ? "/home"
          : "/auth/onboarding",
      );
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      callbacks?.onError?.(error);
    },
  });
}

export function useRegisterMutation(callbacks?: MutationCallbacks) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: SignUpPayload) => signUp(payload),
    onSuccess: (response) => {
      setAuth(response.data.customer, response.data.tokens);
      toast.success(response.message);
      router.replace("/auth/onboarding");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      callbacks?.onError?.(error);
    },
  });
}

export function useSignOutMutation() {
  const router = useRouter();
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: () => signOut(refreshToken),
    onSettled: () => {
      clearAuth();
      router.replace("/auth/login");
    },
  });
}
