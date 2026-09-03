"use client";

import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { INVOICE_STATUS_META } from "../lib/utils";
import { CustomerInvoice } from "../types";

export function InvoiceRow({
  invoice,
  onSelect,
}: {
  invoice: CustomerInvoice;
  onSelect: () => void;
}) {
  const meta = INVOICE_STATUS_META[invoice.status];

  return (
    <button
      onClick={onSelect}
      className="w-full rounded-2xl border border-border bg-background/60 p-3.5 text-start transition-all hover:border-primary/50"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-bold">{invoice.number}</span>
        <Badge variant={meta.badge}>{meta.label}</Badge>
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">{formatDate(invoice.date)}</p>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">الإجمالي</span>
        <span className="font-mono font-bold">{formatCurrency(invoice.total_amount)}</span>
      </div>
      {Number(invoice.balance_due) > 0 && (
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">المتبقي</span>
          <span className="font-mono font-bold text-warning-foreground">
            {formatCurrency(invoice.balance_due)}
          </span>
        </div>
      )}
    </button>
  );
}
