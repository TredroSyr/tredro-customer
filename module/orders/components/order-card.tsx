"use client";

import { IconRenderer } from "@/assets/icons/iconRenderer";
import { formatCurrency, formatDate } from "@/lib/format";
import { Order } from "../types";
import { OrderStatusBadge } from "./order-status-badge";

export function OrderCard({ order, onSelect }: { order: Order; onSelect: () => void }) {
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
            <p className="truncate text-sm font-bold">{order.company_name}</p>
            <p className="text-[10px] text-muted-foreground">{formatDate(order.created_at)}</p>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-2.5 space-y-1">
        {order.lines.slice(0, 2).map((line) => (
          <p key={line.id} className="truncate text-[11px] text-muted-foreground">
            {line.product_name} × {line.quantity}
          </p>
        ))}
        {order.lines.length > 2 && (
          <p className="text-[11px] text-muted-foreground">+{order.lines.length - 2} أصناف أخرى</p>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2.5">
        <span className="text-[11px] text-muted-foreground">الإجمالي</span>
        <span className="font-mono text-xs font-extrabold">{formatCurrency(order.total_amount)}</span>
      </div>
    </button>
  );
}
