"use client";

import { useQuery } from "@tanstack/react-query";
import { getInvoiceById, getInvoices } from "../api";
import { InvoicesListParams } from "../types";

export function useInvoicesQuery(params: InvoicesListParams = {}) {
  return useQuery({
    queryKey: ["invoices", params],
    queryFn: () => getInvoices(params),
    select: (res) => res.data.invoices,
  });
}

export function useInvoiceByIdQuery(id: number | null) {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoiceById(id as number),
    select: (res) => res.data.invoice,
    enabled: id !== null,
  });
}
