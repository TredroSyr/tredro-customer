import { ClaimStatus } from "../types";

export const CLAIM_STATUS_META: Record<
  ClaimStatus,
  { label: string; badge: "success" | "warning" | "destructive" | "secondary" }
> = {
  pending: { label: "قيد الانتظار", badge: "warning" },
  reviewed: { label: "تمت المراجعة", badge: "secondary" },
  resolved: { label: "تم الحل", badge: "success" },
  rejected: { label: "مرفوضة", badge: "destructive" },
};
