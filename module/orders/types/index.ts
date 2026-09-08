import { Pagination } from "@/lib/api-types";

export type OrderStatus = "pending" | "accepted" | "fulfilled" | "rejected" | "cancelled";

export interface OrderLine {
  id: number;
  product: number;
  product_name: string;
  product_sku: string;
  unit: number;
  unit_name: string;
  desired_quantity: string;
  unit_price: string | null;
  line_total: string | null;
}

export interface OrderSummary {
  id: number;
  company: number;
  customer: number;
  customer_name: string;
  customer_phone: string;
  rep: number | null;
  rep_name: string | null;
  status: OrderStatus;
  fulfilled_by_invoice: number | null;
  fulfilled_by_invoice_number: string | null;
  fulfilled_at: string | null;
  cancelled_at: string | null;
  accepted_at: string | null;
  rejected_at: string | null;
  rejection_reason: string;
  line_count: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Order extends OrderSummary {
  lines: OrderLine[];
  estimated_total: string | null;
}

export interface OrdersListParams {
  page?: number;
  status?: OrderStatus;
  company_id?: number;
}

export interface OrdersListResponse {
  success: boolean;
  message: string;
  data: { requests: OrderSummary[]; pagination: Pagination };
}

export interface OrderDetailResponse {
  success: boolean;
  message: string;
  data: { request: Order };
}

export interface CreateOrderPayload {
  company_id: number;
  notes?: string;
  lines: { product_id: number; quantity: string }[];
}
