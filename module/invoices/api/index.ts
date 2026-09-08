import api from "@/lib/axios";
import { InvoiceDetailResponse, InvoicesListParams, InvoicesListResponse } from "../types";

export async function getInvoices(
  params: InvoicesListParams = {},
): Promise<InvoicesListResponse> {
  const { data } = await api.get<InvoicesListResponse>("/customers/invoices/", { params });
  return data;
}

export async function getInvoiceById(id: number): Promise<InvoiceDetailResponse> {
  const { data } = await api.get<InvoiceDetailResponse>(`/customers/invoices/${id}/`);
  return data;
}
