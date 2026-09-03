import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_META } from "../lib/utils";
import { OrderStatus } from "../types";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUS_META[status];
  return <Badge variant={meta.badge}>{meta.label}</Badge>;
}
