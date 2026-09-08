"use client";

import { IconRenderer } from "@/assets/icons/iconRenderer";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import { useCompanyByIdQuery } from "@/module/companies/hooks";
import { OrderSummary } from "../types";
import { OrderStatusBadge } from "./order-status-badge";

export function OrderCard({ order, onSelect }: { order: OrderSummary; onSelect: () => void }) {
  const { data: company } = useCompanyByIdQuery(order.company);

  return (
    <button
      onClick={onSelect}
      className="w-full rounded-2xl border border-border bg-background/60 p-3.5 text-start transition-all hover:border-primary/50"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
            <IconRenderer name="store_filled" className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{company?.name ?? `طلب #${order.id}`}</p>
            <p className="text-[10px] text-muted-foreground">{formatDate(order.created_at)}</p>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2.5">
        <span className="text-[11px] text-muted-foreground">
          {order.line_count} {order.line_count === 1 ? "صنف" : "أصناف"}
        </span>
        {order.rep_name && (
          <span className="text-[11px] text-muted-foreground">المندوب: {order.rep_name}</span>
        )}
      </div>
    </button>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="w-full rounded-2xl border border-border bg-background/60 p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Skeleton className="size-8 shrink-0 rounded-xl" />
          <div className="min-w-0 space-y-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2.5">
        <Skeleton className="h-2.5 w-12" />
        <Skeleton className="h-2.5 w-20" />
      </div>
    </div>
  );
}
