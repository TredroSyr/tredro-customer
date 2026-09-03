"use client";

import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/tredro/empty-state";
import { Company } from "../types";
import { CompanyCard } from "./company-card";

export function CompaniesList({
  companies,
  isLoading,
  hasFilters,
  onClearFilters,
  onSelect,
}: {
  companies: Company[];
  isLoading: boolean;
  hasFilters: boolean;
  onClearFilters: () => void;
  onSelect: (companyId: number) => void;
}) {
  if (isLoading) {
    return (
      <div className="mt-4 space-y-2">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="mt-4">
        <EmptyState
          variant="companies"
          size="sm"
          title={hasFilters ? "لا توجد شركات مطابقة لبحثك" : undefined}
          description={
            hasFilters
              ? "يُرجى تعديل كلمة البحث أو عوامل التصفية المستخدمة."
              : undefined
          }
        >
          {hasFilters && (
            <Button size="sm" variant="secondary" className="mt-6" onClick={onClearFilters}>
              مسح عوامل التصفية
            </Button>
          )}
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onSelect={() => onSelect(company.id)}
        />
      ))}
    </div>
  );
}
