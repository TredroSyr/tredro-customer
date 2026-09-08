"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate, formatQuantity } from "@/lib/format";
import { INVOICE_STATUS_META, PAYMENT_SOURCE_LABEL, REFUND_METHOD_LABEL } from "../lib/utils";
import { useInvoiceByIdQuery } from "../hooks";

export function InvoiceDetailDrawer({
  invoiceId,
  open,
  onOpenChange,
}: {
  invoiceId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: invoice, isLoading } = useInvoiceByIdQuery(invoiceId);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="up">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{invoice ? `فاتورة ${invoice.number}` : "الفاتورة"}</DrawerTitle>
        </DrawerHeader>

        {isLoading && (
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4 pt-2">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        )}

        {invoice && (
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{formatDate(invoice.date)}</span>
              <Badge variant={INVOICE_STATUS_META[invoice.status].badge}>
                {INVOICE_STATUS_META[invoice.status].label}
              </Badge>
            </div>

            <div className="space-y-2">
              {invoice.lines.map((line) => (
                <div
                  key={line.id}
                  className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2 text-xs"
                >
                  <div className="min-w-0">
                    <p className="truncate font-bold">{line.product_name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatQuantity(line.quantity)} {line.unit_name} × {formatCurrency(line.unit_price)}
                    </p>
                    {line.returned_quantity && (
                      <p className="text-[10px] text-destructive">
                        أُرجع {formatQuantity(line.returned_quantity)} من {formatQuantity(line.quantity)}
                      </p>
                    )}
                  </div>
                  <span className="font-mono font-bold">{formatCurrency(line.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 rounded-xl border border-border p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">الإجمالي</span>
                <span className="font-mono font-bold">{formatCurrency(invoice.total_amount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">المدفوع</span>
                <span className="font-mono font-bold text-success">
                  {formatCurrency(invoice.paid_amount)}
                </span>
              </div>
              {Number(invoice.returned_amount) > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">المرتجع</span>
                  <span className="font-mono font-bold">{formatCurrency(invoice.returned_amount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">المتبقي</span>
                <span className="font-mono font-bold">{formatCurrency(invoice.balance_due)}</span>
              </div>
            </div>

            {invoice.payments.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground">الدفعات</p>
                {invoice.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold">{PAYMENT_SOURCE_LABEL[payment.source]}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDate(payment.collected_at)} · {payment.collected_by_name ?? "المكتب"}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-success">
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {invoice.returns.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground">المرتجعات</p>
                {invoice.returns.map((ret) => (
                  <div
                    key={ret.id}
                    className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold">{ret.number}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDate(ret.issued_at)}
                        {ret.refund_method && ` · ${REFUND_METHOD_LABEL[ret.refund_method]}`}
                      </p>
                    </div>
                    <span className="font-mono font-bold">{formatCurrency(ret.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
