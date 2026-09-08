"use client";

import { useState } from "react";
import { useCategoriesQuery } from "@/module/categories/hooks";
import { CategoryFilterBar } from "@/module/categories/components/category-filter-bar";
import { useProductsQuery } from "@/module/products/hooks";
import { ProductGrid } from "@/module/products/components/product-grid";
import { CartReviewDrawer } from "./cart-review-drawer";
import { Company } from "../../types";

export function CompanyProductsTab({ company }: { company: Company }) {
  const [categoryId, setCategoryId] = useState<number | "all">("all");
  const [cartOpen, setCartOpen] = useState(false);
  const { data: categories = [] } = useCategoriesQuery(company.id);
  const { data: products = [], isLoading } = useProductsQuery(company.id, {
    category: categoryId === "all" ? undefined : categoryId,
  });

  return (
    <div className="space-y-4 ">
      <CategoryFilterBar
        categories={categories}
        value={categoryId}
        onChange={setCategoryId}
      />
      <ProductGrid
        products={products}
        isLoading={isLoading}
        companyId={company.id}
      />

      <CartReviewDrawer
        company={company}
        open={cartOpen}
        onOpenChange={setCartOpen}
      />
    </div>
  );
}
