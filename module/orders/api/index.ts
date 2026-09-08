import api from "@/lib/axios";
import {
  CreateOrderPayload,
  OrderDetailResponse,
  OrdersListParams,
  OrdersListResponse,
} from "../types";

export async function getOrders(params: OrdersListParams = {}): Promise<OrdersListResponse> {
  const { data } = await api.get<OrdersListResponse>("/customers/requests/", {
    params: {
      page: params.page,
      status: params.status,
      company: params.company_id,
    },
  });
  return data;
}

export async function getOrderById(id: number): Promise<OrderDetailResponse> {
  const { data } = await api.get<OrderDetailResponse>(`/customers/requests/${id}/`);
  return data;
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderDetailResponse> {
  const { data } = await api.post<OrderDetailResponse>("/customers/requests/", payload);
  return data;
}

export async function cancelOrder(id: number): Promise<OrderDetailResponse> {
  const { data } = await api.post<OrderDetailResponse>(
    `/customers/requests/${id}/cancel/`,
    {},
  );
  return data;
}
