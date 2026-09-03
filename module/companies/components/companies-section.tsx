"use client";

import { useRouter } from "next/navigation";
import { useCompaniesQuery } from "../hooks";
import { CompaniesList } from "./companies-list";

export function CompaniesSection() {
  const router = useRouter();
  const { data: companies = [], isLoading } = useCompaniesQuery();

  return (
    <section>
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-extrabold">الشركات</h2>
        <button
          type="button"
          onClick={() => router.push("/companies")}
          className="text-xs font-bold text-primary"
        >
          عرض الكل
        </button>
      </div>
      <CompaniesList
        companies={companies.slice(0, 4)}
        isLoading={isLoading}
        hasFilters={false}
        onClearFilters={() => {}}
        onSelect={(id) => router.push(`/companies/detail?id=${id}`)}
      />
    </section>
  );
}
