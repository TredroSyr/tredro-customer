"use client";

import { useQuery } from "@tanstack/react-query";
import { getInvoicesByCompany, getInvoiceById } from "../api";

export function useInvoicesByCompanyQuery(companyId: number | null, companyName = "") {
  return useQuery({
    queryKey: ["invoices", companyId],
    queryFn: () => getInvoicesByCompany(companyId as number, companyName),
    select: (res) => res.data.invoices,
    enabled: companyId !== null,
  });
}

export function useInvoiceByIdQuery(
  companyId: number | null,
  invoiceId: number | null,
  companyName = "",
) {
  return useQuery({
    queryKey: ["invoice", companyId, invoiceId],
    queryFn: () => getInvoiceById(companyId as number, invoiceId as number, companyName),
    select: (res) => res.data.invoice,
    enabled: companyId !== null && invoiceId !== null,
  });
}
