"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/tredro/empty-state";
import { formatCurrency, formatDate, formatQuantity } from "@/lib/format";
import { useCancelOrderMutation, useOrderByIdQuery } from "@/module/orders/hooks";
import { OrderStatusBadge } from "@/module/orders/components/order-status-badge";
import { useCompanyByIdQuery } from "@/module/companies/hooks";

function OrderDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const { data: order, isLoading } = useOrderByIdQuery(Number.isFinite(id) ? id : null);
  const { data: company } = useCompanyByIdQuery(order?.company ?? null);
  const cancelMutation = useCancelOrderMutation();

  if (isLoading) {
    return (
      <div className="space-y-4 pb-6">
        <Skeleton className="size-9 rounded-2xl" />

        <div className="rounded-2xl border border-border bg-background/60 p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="mt-2 h-2.5 w-24" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>

        <Skeleton className="h-14 w-full rounded-2xl" />
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

  const handleCancel = () => {
    cancelMutation.mutate(order.id, {
      onSuccess: (response) => toast.success(response.message),
      onError: () => toast.error("تعذر إلغاء الطلب، يرجى تحديث الصفحة والمحاولة مجدداً"),
    });
  };

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
          <h1 className="text-sm font-extrabold">{company?.name ?? `طلب #${order.id}`}</h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">{formatDate(order.created_at)}</p>
        {order.rep_name && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <IconRenderer name="store_outlined" className="size-3.5" />
            المندوب: {order.rep_name}
          </p>
        )}
        {order.notes && (
          <p className="mt-1 text-xs text-muted-foreground">ملاحظات: {order.notes}</p>
        )}
        {order.status === "rejected" && order.rejection_reason && (
          <p className="mt-2 rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
            سبب الرفض: {order.rejection_reason}
          </p>
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
                {formatQuantity(line.desired_quantity)} {line.unit_name}
                {line.unit_price ? ` × ${formatCurrency(line.unit_price)}` : ""}
              </p>
            </div>
            <span className="font-mono font-bold">
              {line.line_total ? formatCurrency(line.line_total) : "السعر غير متاح"}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-border p-3.5">
        <span className="text-sm font-bold">الإجمالي التقديري</span>
        <span className="font-mono text-base font-extrabold text-primary">
          {order.estimated_total ? formatCurrency(order.estimated_total) : "غير متاح بعد"}
        </span>
      </div>

      {order.status === "pending" && (
        <Button
          type="button"
          variant="destructive"
          className="w-full rounded-2xl py-4 text-sm font-extrabold"
          disabled={cancelMutation.isPending}
          onClick={handleCancel}
        >
          {cancelMutation.isPending ? "جاري الإلغاء..." : "إلغاء الطلب"}
        </Button>
      )}
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
