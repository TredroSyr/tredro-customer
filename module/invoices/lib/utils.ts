import { InvoiceStatus, PaymentSource, RefundMethod } from "../types";

export const INVOICE_STATUS_META: Record<
  InvoiceStatus,
  { label: string; badge: "success" | "warning" | "destructive" }
> = {
  fully_paid: { label: "مدفوعة بالكامل", badge: "success" },
  partially_paid: { label: "مدفوعة جزئياً", badge: "warning" },
  deferred: { label: "غير مدفوعة", badge: "destructive" },
};

export const INVOICE_FILTERS: { key: InvoiceStatus | "all"; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "deferred", label: "غير مدفوعة" },
  { key: "partially_paid", label: "مدفوعة جزئياً" },
  { key: "fully_paid", label: "مدفوعة بالكامل" },
];

export const PAYMENT_SOURCE_LABEL: Record<PaymentSource, string> = {
  cash: "نقداً",
  customer_credit: "من الرصيد",
};

export const REFUND_METHOD_LABEL: Record<Exclude<RefundMethod, "">, string> = {
  cash_refunded_by_rep: "استرجاع نقدي من المندوب",
  deferred_customer_credit: "أضيف كرصيد",
};
