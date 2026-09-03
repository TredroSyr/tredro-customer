import { InvoiceStatus } from "../types";

export const INVOICE_STATUS_META: Record<
  InvoiceStatus,
  { label: string; badge: "success" | "warning" | "destructive" }
> = {
  fully_paid: { label: "مدفوعة بالكامل", badge: "success" },
  partially_paid: { label: "مدفوعة جزئياً", badge: "warning" },
  deferred: { label: "غير مدفوعة", badge: "destructive" },
};
