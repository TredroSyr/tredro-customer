"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductsByCompany, getProductById } from "../api";
import { ProductsListParams } from "../types";

export function useProductsQuery(
  companyId: number | null,
  params: ProductsListParams = {},
) {
  return useQuery({
    queryKey: ["products", companyId, params],
    queryFn: () => getProductsByCompany(companyId as number, params),
    select: (res) => res.data.products,
    enabled: companyId !== null,
  });
}

export function useProductByIdQuery(id: number | null) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id as number),
    select: (res) => res.data.product,
    enabled: id !== null,
  });
}
