import { OrderStatus } from "../types";

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; badge: "default" | "secondary" | "success" | "warning" | "destructive" }
> = {
  pending: { label: "قيد المراجعة", badge: "secondary" },
  accepted: { label: "تم القبول", badge: "default" },
  preparing: { label: "قيد التجهيز", badge: "warning" },
  out_for_delivery: { label: "في الطريق", badge: "default" },
  delivered: { label: "تم التوصيل", badge: "success" },
  cancelled: { label: "ملغي", badge: "destructive" },
  rejected: { label: "مرفوض", badge: "destructive" },
};

export const ORDER_FILTERS: { key: OrderStatus | "all"; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "pending", label: "قيد المراجعة" },
  { key: "preparing", label: "قيد التجهيز" },
  { key: "out_for_delivery", label: "في الطريق" },
  { key: "delivered", label: "تم التوصيل" },
  { key: "cancelled", label: "ملغي" },
];
