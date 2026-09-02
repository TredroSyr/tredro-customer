export interface Customer {
  id: number;
  name: string;
  phone: string;
  avatar: string | null;
  created_at: string;
}

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export interface AuthTokens {
  access: string;
}

export interface AuthResponseData {
  user: Customer;
  tokens: AuthTokens;
}

export interface AuthApiResponse {
  success: boolean;
  message: string;
  data: AuthResponseData;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
