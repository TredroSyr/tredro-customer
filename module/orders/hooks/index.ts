"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOrder, getOrderById, getOrders } from "../api";
import { CreateOrderPayload, OrdersListParams } from "../types";

export function useOrdersQuery(params: OrdersListParams = {}) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrders(params),
    select: (res) => res.data.orders,
  });
}

export function useOrderByIdQuery(id: number | null) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id as number),
    select: (res) => res.data.order,
    enabled: id !== null,
  });
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
