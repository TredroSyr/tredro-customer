export interface AssignedRep {
  id: number;
  name: string;
  phone: string;
  company_id: number;
}

export interface CategoryDetails {
  id: number;
  name: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  category: number | null;
  category_details: CategoryDetails | null;
  referral_code_used: string | null;
  assigned_reps: AssignedRep[];
  address: string;
  latitude: string | null;
  longitude: string | null;
  has_location: boolean;
  onboarding_completed: boolean;
  onboarding_completed_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  /** Not returned by the API yet; kept optional so avatar UI keeps working once a backend field lands. */
  avatar?: string | null;
}

export interface SignUpPayload {
  name: string;
  phone: string;
  password: string;
}

export interface SignInPayload {
  phone: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponseData {
  customer: Customer;
  tokens: AuthTokens;
}

export interface AuthApiResponse {
  success: boolean;
  message: string;
  data: AuthResponseData;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: { access: string };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
