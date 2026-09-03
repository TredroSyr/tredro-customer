import api from "@/lib/axios";
import {
  CategoriesResponse,
  OnboardingPayload,
  OnboardingResponse,
  OnboardingStatusResponse,
} from "../types";

export async function getBusinessCategories(): Promise<CategoriesResponse> {
  const { data } = await api.get<CategoriesResponse>("/customers/categories");
  return data;
}

export async function completeOnboarding(
  payload: OnboardingPayload,
): Promise<OnboardingResponse> {
  const { data } = await api.post<OnboardingResponse>(
    "/customers/onboarding",
    payload,
  );
  return data;
}

export async function getOnboardingStatus(): Promise<OnboardingStatusResponse> {
  const { data } = await api.get<OnboardingStatusResponse>(
    "/customers/onboarding/status",
  );
  return data;
}
