"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { useCompaniesQuery } from "@/module/companies/hooks";
import { CompaniesList } from "@/module/companies/components/companies-list";

export default function CompaniesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");

  const { data: companies = [], isLoading } = useCompaniesQuery({
    search: search || undefined,
  });

  const hasFilters = useMemo(() => search.trim().length > 0, [search]);

  return (
    <div className="space-y-4 pb-6">
      <div className="relative">
        <IconRenderer
          name="search_outlined"
          className="pointer-events-none absolute top-1/2 start-2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن شركة..."
          className="ps-11"
        />
      </div>

      <CompaniesList
        companies={companies}
        isLoading={isLoading}
        hasFilters={hasFilters}
        onClearFilters={() => setSearch("")}
        onSelect={(id) => router.push(`/companies/detail?id=${id}`)}
      />
    </div>
  );
}
