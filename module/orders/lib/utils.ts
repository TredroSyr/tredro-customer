import { OrderStatus } from "../types";

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; badge: "default" | "secondary" | "success" | "warning" | "destructive" | "outline" }
> = {
  pending: { label: "قيد المراجعة", badge: "secondary" },
  accepted: { label: "تم القبول", badge: "default" },
  fulfilled: { label: "تم التوريد", badge: "success" },
  rejected: { label: "مرفوض", badge: "destructive" },
  cancelled: { label: "ملغي", badge: "outline" },
};

export const ORDER_FILTERS: { key: OrderStatus | "all"; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "pending", label: "قيد المراجعة" },
  { key: "accepted", label: "تم القبول" },
  { key: "fulfilled", label: "تم التوريد" },
  { key: "rejected", label: "مرفوض" },
  { key: "cancelled", label: "ملغي" },
];
