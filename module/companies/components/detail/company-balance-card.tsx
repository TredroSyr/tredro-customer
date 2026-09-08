"use client";

import { IconRenderer } from "@/assets/icons/iconRenderer";
import { formatCurrency } from "@/lib/format";
import { useInvoicesQuery } from "@/module/invoices/hooks";
import { Company } from "../../types";
import { SubmitClaimButton } from "./submit-claim-button";

export function CompanyBalanceCard({ company }: { company: Company }) {
  const { data: invoices = [] } = useInvoicesQuery({ company: company.id, outstanding: true });
  const balanceDue = invoices.reduce((sum, i) => sum + Number(i.balance_due), 0);

  return (
    <div className="space-y-3 pb-6">
      <div
        className={`rounded-2xl border p-4 ${
          balanceDue > 0 ? "warning-banner" : "border-border bg-secondary"
        }`}
      >
        <div className="flex items-center gap-2">
          <IconRenderer
            name={balanceDue > 0 ? "warning_outlined" : "success_outlined"}
            className="size-5"
          />
          <span className="text-sm font-bold">الرصيد المستحق لهذه الشركة</span>
        </div>
        <p className="mt-2 font-mono text-2xl font-extrabold">
          {formatCurrency(String(balanceDue))}
        </p>
      </div>

      <SubmitClaimButton company={company} />
    </div>
  );
}
