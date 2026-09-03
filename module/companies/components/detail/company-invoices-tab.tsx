"use client";

import { useState } from "react";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/tredro/empty-state";
import { useInvoicesByCompanyQuery } from "@/module/invoices/hooks";
import { InvoiceRow } from "@/module/invoices/components/invoice-row";
import { InvoiceDetailDrawer } from "@/module/invoices/components/invoice-detail-drawer";
import { CustomerInvoice } from "@/module/invoices/types";
import { Company } from "../../types";

export function CompanyInvoicesTab({ company }: { company: Company }) {
  const { data: invoices = [], isLoading } = useInvoicesByCompanyQuery(company.id, company.name);
  const [selected, setSelected] = useState<CustomerInvoice | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-2 pb-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="pb-6">
        <EmptyState variant="invoices" size="sm" />
      </div>
    );
  }

  return (
    <div className="space-y-2 pb-6">
      {invoices.map((invoice) => (
        <InvoiceRow key={invoice.id} invoice={invoice} onSelect={() => setSelected(invoice)} />
      ))}
      <InvoiceDetailDrawer
        invoice={selected}
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </div>
  );
}
