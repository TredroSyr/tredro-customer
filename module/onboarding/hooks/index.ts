"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getBusinessCategories, completeOnboarding, getOnboardingStatus } from "../api";
import { OnboardingPayload } from "../types";
import { ApiErrorResponse } from "@/module/auth/types";
import { useAuthStore } from "@/module/auth/store/auth-store";

export function useBusinessCategoriesQuery() {
  return useQuery({
    queryKey: ["onboarding", "categories"],
    queryFn: getBusinessCategories,
    select: (res) => res.data.categories,
  });
}

interface MutationCallbacks {
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}

export function useCompleteOnboardingMutation(callbacks?: MutationCallbacks) {
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: (payload: OnboardingPayload) => completeOnboarding(payload),
    onSuccess: (response) => {
      updateUser(response.data.customer);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      callbacks?.onError?.(error);
    },
  });
}

export function useOnboardingStatusQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["onboarding", "status"],
    queryFn: getOnboardingStatus,
    enabled,
    retry: false,
  });
}
