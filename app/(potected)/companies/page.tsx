"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { useCategoriesQuery } from "@/module/categories/hooks";
import { CategoryFilterBar } from "@/module/categories/components/category-filter-bar";
import { useCompaniesQuery } from "@/module/companies/hooks";
import { CompaniesList } from "@/module/companies/components/companies-list";

export default function CompaniesPage() {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState<number | "all">("all");
  const [search, setSearch] = useState("");

  const { data: categories = [] } = useCategoriesQuery();
  const { data: companies = [], isLoading } = useCompaniesQuery({
    category_id: categoryId === "all" ? undefined : categoryId,
    q: search || undefined,
  });

  const hasFilters = useMemo(
    () => categoryId !== "all" || search.trim().length > 0,
    [categoryId, search],
  );

  return (
    <div className="space-y-4 pb-6">
      <div className="relative">
        <IconRenderer
          name="search_outlined"
          className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن شركة..."
          className="ps-9"
        />
      </div>

      <CategoryFilterBar
        categories={categories}
        value={categoryId}
        onChange={setCategoryId}
      />

      <CompaniesList
        companies={companies}
        isLoading={isLoading}
        hasFilters={hasFilters}
        onClearFilters={() => {
          setCategoryId("all");
          setSearch("");
        }}
        onSelect={(id) => router.push(`/companies/detail?id=${id}`)}
      />
    </div>
  );
}
