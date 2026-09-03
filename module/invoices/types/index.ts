export type InvoiceStatus = "fully_paid" | "partially_paid" | "deferred";

export interface InvoiceLine {
  id: number;
  product_name: string;
  unit_name: string;
  quantity: string;
  unit_price: string;
  line_total: string;
}

export interface CustomerInvoice {
  id: number;
  number: string;
  company_id: number;
  company_name: string;
  date: string;
  total_amount: string;
  paid_amount: string;
  balance_due: string;
  status: InvoiceStatus;
  currency: string;
  lines: InvoiceLine[];
}

export interface InvoicesListResponse {
  success: boolean;
  message: string;
  data: { invoices: CustomerInvoice[] };
}

export interface InvoiceDetailResponse {
  success: boolean;
  message: string;
  data: { invoice: CustomerInvoice };
}
