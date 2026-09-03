import { Customer } from "@/module/auth/types";

export interface BusinessCategory {
  id: number;
  name: string;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: { categories: BusinessCategory[] };
}

export interface OnboardingPayload {
  category?: number;
  referral_code?: string;
  governorate?: string;
  region?: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface OnboardingResponse {
  success: boolean;
  message: string;
  data: { customer: Customer };
}

export interface OnboardingStatusResponse {
  success: boolean;
  message: string;
  data: {
    onboarding_completed: boolean;
    customer: Customer;
  };
}
