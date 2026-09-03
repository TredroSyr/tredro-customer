"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/tredro/empty-state";
import { formatCurrency, formatDate } from "@/lib/format";
import { useOrderByIdQuery } from "@/module/orders/hooks";
import { OrderStatusBadge } from "@/module/orders/components/order-status-badge";

function OrderDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const { data: order, isLoading } = useOrderByIdQuery(Number.isFinite(id) ? id : null);

  if (isLoading) {
    return (
      <div className="space-y-2 pb-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pb-6">
        <EmptyState variant="orders" size="sm" title="الطلب غير موجود" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="grid size-9 place-items-center rounded-2xl bg-secondary text-foreground"
      >
        <IconRenderer name="arrow_right_outlined" className="size-4" />
      </button>

      <div className="rounded-2xl border border-border bg-background/60 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-extrabold">{order.company_name}</h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">{formatDate(order.created_at)}</p>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <IconRenderer name="location_outlined" className="size-3.5" />
          {order.delivery_address}
        </p>
        {order.notes && (
          <p className="mt-1 text-xs text-muted-foreground">ملاحظات: {order.notes}</p>
        )}
      </div>

      <div className="space-y-2">
        {order.lines.map((line) => (
          <div
            key={line.id}
            className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2 text-xs"
          >
            <div className="min-w-0">
              <p className="truncate font-bold">{line.product_name}</p>
              <p className="text-[10px] text-muted-foreground">
                {line.quantity} {line.unit_name} × {formatCurrency(line.unit_price)}
              </p>
            </div>
            <span className="font-mono font-bold">{formatCurrency(line.line_total)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-border p-3.5">
        <span className="text-sm font-bold">الإجمالي</span>
        <span className="font-mono text-base font-extrabold text-primary">
          {formatCurrency(order.total_amount)}
        </span>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<Skeleton className="h-40 w-full rounded-2xl" />}>
      <OrderDetailContent />
    </Suspense>
  );
}
