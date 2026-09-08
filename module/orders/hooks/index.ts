"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelOrder, createOrder, getOrderById, getOrders } from "../api";
import { CreateOrderPayload, OrdersListParams } from "../types";

export function useOrdersQuery(params: OrdersListParams = {}) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrders(params),
    select: (res) => res.data.requests,
  });
}

export function useOrderByIdQuery(id: number | null) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id as number),
    select: (res) => res.data.request,
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

export function useCancelOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cancelOrder(id),
    onSuccess: (_res, id) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    },
  });
}
