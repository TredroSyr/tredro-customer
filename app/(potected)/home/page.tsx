"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HomeLocationBar } from "@/module/home/components/home-location-bar";
import { useCategoriesQuery } from "@/module/categories/hooks";
import { CategoryFilterBar } from "@/module/categories/components/category-filter-bar";
import { NearbyCompaniesSection } from "@/module/companies/components/nearby-companies-section";
import { CompaniesSection } from "@/module/companies/components/companies-section";
import { RecentOrdersSection } from "@/module/orders/components/recent-orders-section";

export default function HomePage() {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState<number | "all">("all");
  const { data: categories = [] } = useCategoriesQuery();

  const handleCategoryChange = (value: number | "all") => {
    setCategoryId(value);
    if (value !== "all") {
      router.push(`/companies?category_id=${value}`);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      <HomeLocationBar />

      <CategoryFilterBar
        categories={categories}
        value={categoryId}
        onChange={handleCategoryChange}
      />

      <NearbyCompaniesSection />

      <RecentOrdersSection />

      <CompaniesSection />
    </div>
  );
}
