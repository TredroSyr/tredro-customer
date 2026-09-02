import { mockDelay } from "@/lib/mock";
import {
  ApiErrorResponse,
  AuthApiResponse,
  Customer,
  LoginCredentials,
  RegisterPayload,
} from "../types";

/**
 * Stand-ins for the eventual `/auth/customer/signin` and
 * `/auth/customer/signup` endpoints. No axios/backend call — everything is
 * held in this in-memory array for the lifetime of the tab, seeded with one
 * demo account so login can be tested without registering first.
 */
let mockUsers: (Customer & { password: string })[] = [
  {
    id: 1,
    name: "أحمد الحلبي",
    phone: "+963912345678",
    password: "123456",
    avatar: null,
    created_at: "2025-01-01T00:00:00.000Z",
  },
];

let nextId = 2;

export class MockApiError extends Error {
  response: { data: ApiErrorResponse };
  constructor(data: ApiErrorResponse) {
    super(data.message);
    this.response = { data };
  }
}

function toAuthResponse(user: Customer, message: string): AuthApiResponse {
  return {
    success: true,
    message,
    data: {
      user,
      tokens: { access: `mock-token-${user.id}-${Date.now()}` },
    },
  };
}

export async function login(
  credentials: LoginCredentials,
): Promise<AuthApiResponse> {
  await mockDelay(null, 600);
  const match = mockUsers.find((u) => u.phone === credentials.phone);

  if (!match || match.password !== credentials.password) {
    throw new MockApiError({
      success: false,
      message: "رقم الهاتف أو كلمة المرور غير صحيحة",
    });
  }

  const { password: _password, ...user } = match;
  return toAuthResponse(user, "تم تسجيل الدخول بنجاح");
}

export async function register(
  payload: RegisterPayload,
): Promise<AuthApiResponse> {
  await mockDelay(null, 600);

  if (mockUsers.some((u) => u.phone === payload.phone)) {
    throw new MockApiError({
      success: false,
      message: "رقم الهاتف مستخدم مسبقاً",
      errors: { phone: ["رقم الهاتف مستخدم مسبقاً"] },
    });
  }

  const newUser: Customer & { password: string } = {
    id: nextId++,
    name: payload.name,
    phone: payload.phone,
    password: payload.password,
    avatar: null,
    created_at: new Date().toISOString(),
  };
  mockUsers = [...mockUsers, newUser];

  const { password: _password, ...user } = newUser;
  return toAuthResponse(user, "تم إنشاء الحساب بنجاح");
}
