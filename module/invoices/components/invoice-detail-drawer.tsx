"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { INVOICE_STATUS_META } from "../lib/utils";
import { CustomerInvoice } from "../types";

export function InvoiceDetailDrawer({
  invoice,
  open,
  onOpenChange,
}: {
  invoice: CustomerInvoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="up">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{invoice ? `فاتورة ${invoice.number}` : "الفاتورة"}</DrawerTitle>
        </DrawerHeader>
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
                      {line.quantity} {line.unit_name} × {formatCurrency(line.unit_price)}
                    </p>
                  </div>
                  <span className="font-mono font-bold">{formatCurrency(line.line_total)}</span>
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
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">المتبقي</span>
                <span className="font-mono font-bold">{formatCurrency(invoice.balance_due)}</span>
              </div>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
