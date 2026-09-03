import { Pagination } from "@/lib/api-types";

export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "rejected";

export interface OrderLine {
  id: number;
  product_id: number;
  product_name: string;
  unit_name: string;
  quantity: string;
  unit_price: string;
  line_total: string;
}

export interface Order {
  id: number;
  company_id: number;
  company_name: string;
  status: OrderStatus;
  lines: OrderLine[];
  total_amount: string;
  delivery_address: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrdersListParams {
  status?: OrderStatus;
  company_id?: number;
}

export interface OrdersListResponse {
  success: boolean;
  message: string;
  data: { orders: Order[]; pagination: Pagination };
}

export interface OrderDetailResponse {
  success: boolean;
  message: string;
  data: { order: Order };
}

export interface CreateOrderPayload {
  company_id: number;
  company_name: string;
  delivery_address: string;
  notes?: string;
  lines: {
    product_id: number;
    product_name: string;
    unit_name: string;
    quantity: number;
    unit_price: string;
  }[];
}
