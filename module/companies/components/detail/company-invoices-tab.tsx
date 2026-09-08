"use client";

import { useState } from "react";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/tredro/empty-state";
import { useInvoicesQuery } from "@/module/invoices/hooks";
import { InvoiceRow } from "@/module/invoices/components/invoice-row";
import { InvoiceDetailDrawer } from "@/module/invoices/components/invoice-detail-drawer";
import { InvoiceFilterTabs } from "@/module/invoices/components/invoice-filter-tabs";
import { InvoiceStatus } from "@/module/invoices/types";
import { Company } from "../../types";

export function CompanyInvoicesTab({ company }: { company: Company }) {
  const [status, setStatus] = useState<InvoiceStatus | "all">("all");
  const { data: invoices = [], isLoading } = useInvoicesQuery({
    company: company.id,
    status: status === "all" ? undefined : status,
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className="space-y-3 pb-6">
      <InvoiceFilterTabs value={status} onChange={setStatus} />

      {isLoading ? (
        <div className="space-y-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : invoices.length === 0 ? (
        <EmptyState variant="invoices" size="sm" />
      ) : (
        <div className="space-y-2">
          {invoices.map((invoice) => (
            <InvoiceRow key={invoice.id} invoice={invoice} onSelect={() => setSelectedId(invoice.id)} />
          ))}
        </div>
      )}

      <InvoiceDetailDrawer
        invoiceId={selectedId}
        open={selectedId !== null}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </div>
  );
}
