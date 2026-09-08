import { Pagination } from "@/lib/api-types";

export type InvoiceStatus = "fully_paid" | "partially_paid" | "deferred";

export type PaymentSource = "cash" | "customer_credit";

export type RefundMethod = "" | "cash_refunded_by_rep" | "deferred_customer_credit";

export interface InvoiceLine {
  id: number;
  product: number;
  product_name: string;
  product_sku: string;
  product_barcode: string;
  product_image: { id: number; image: string } | null;
  unit: number;
  unit_name: string;
  unit_code: string;
  quantity: string;
  unit_price: string;
  subtotal: string;
  tax_rate: string;
  returned_quantity: string | null;
}

export interface InvoicePayment {
  id: number;
  sales_invoice: number;
  sales_invoice_number: string;
  amount: string;
  collected_by: number | null;
  collected_by_name: string | null;
  collected_at: string;
  source: PaymentSource;
  applied_credit: number | null;
  note: string;
  created_at: string;
}

export interface InvoiceReturn {
  id: number;
  number: string;
  sales_invoice: number;
  status: "issued";
  amount: string;
  overage_amount: string;
  refund_method: RefundMethod;
  issued_at: string;
}

export interface CustomerInvoice {
  id: number;
  number: string;
  date: string;
  line_count: number;
  rep: number | null;
  rep_name: string | null;
  customer: number;
  customer_name: string;
  customer_phone: string;
  warehouse: number;
  company_name: string;
  tax_registration_no: string;
  currency: string;
  total_amount: string;
  paid_amount: string;
  returned_amount: string;
  balance_due: string;
  overage_amount: string;
  status: InvoiceStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerInvoiceDetail extends CustomerInvoice {
  lines: InvoiceLine[];
  payments: InvoicePayment[];
  returns: InvoiceReturn[];
  fulfilled_request_ids: number[];
}

export interface InvoicesListParams {
  page?: number;
  company?: number;
  status?: InvoiceStatus;
  outstanding?: boolean;
  search?: string;
  date?: string;
  date_from?: string;
  date_to?: string;
}

export interface InvoicesListResponse {
  success: boolean;
  message: string;
  data: { invoices: CustomerInvoice[]; pagination: Pagination };
}

export interface InvoiceDetailResponse {
  success: boolean;
  message: string;
  data: { invoice: CustomerInvoiceDetail };
}
