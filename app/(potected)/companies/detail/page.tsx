"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyByIdQuery } from "@/module/companies/hooks";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/tredro/empty-state";
import { CompanyDetailHeader } from "@/module/companies/components/detail/company-detail-header";
import { CompanyStatsBar } from "@/module/companies/components/detail/company-stats-bar";
import {
  CompanyDetailTabs,
  type CompanyDetailTab,
} from "@/module/companies/components/detail/company-detail-tabs";
import { CompanyProductsTab } from "@/module/companies/components/detail/company-products-tab";
import { CompanyInvoicesTab } from "@/module/companies/components/detail/company-invoices-tab";
import { CompanyOrdersTab } from "@/module/companies/components/detail/company-orders-tab";
import { CompanyAccountTab } from "@/module/companies/components/detail/company-account-tab";
import { CompanyBalanceCard } from "@/module/companies/components/detail/company-balance-card";

function CompanyDetailContent() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const { data: company, isLoading } = useCompanyByIdQuery(
    Number.isFinite(id) ? id : null,
  );
  const [tab, setTab] = useState<CompanyDetailTab>("products");

  if (isLoading) {
    return (
      <div className="space-y-2 pb-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="pb-6">
        <EmptyState variant="companies" size="sm" title="الشركة غير موجودة" />
      </div>
    );
  }

  return (
    <div className="pb-6">
      <CompanyDetailHeader company={company} />
      <CompanyStatsBar company={company} />

      <div className="mt-4">
        <CompanyDetailTabs value={tab} onChange={setTab} />
      </div>

      <div className="mt-4">
        {tab === "products" && <CompanyProductsTab company={company} />}
        {tab === "invoices" && <CompanyInvoicesTab company={company} />}
        {tab === "orders" && <CompanyOrdersTab company={company} />}
        {tab === "account" && <CompanyAccountTab company={company} />}
        {tab === "balance" && <CompanyBalanceCard company={company} />}
      </div>
    </div>
  );
}

export default function CompanyDetailPage() {
  return (
    <Suspense fallback={<SkeletonCard />}>
      <CompanyDetailContent />
    </Suspense>
  );
}
