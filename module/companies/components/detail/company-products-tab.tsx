"use client";

import { useState } from "react";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { formatCurrency } from "@/lib/format";
import { useCategoriesQuery } from "@/module/categories/hooks";
import { CategoryFilterBar } from "@/module/categories/components/category-filter-bar";
import { useProductsQuery } from "@/module/products/hooks";
import { ProductGrid } from "@/module/products/components/product-grid";
import { useCartForCompany } from "@/module/cart/store/use-cart-store";
import { CartReviewDrawer } from "./cart-review-drawer";
import { Company } from "../../types";

export function CompanyProductsTab({ company }: { company: Company }) {
  const [categoryId, setCategoryId] = useState<number | "all">("all");
  const [cartOpen, setCartOpen] = useState(false);
  const { data: categories = [] } = useCategoriesQuery(company.id);
  const { data: products = [], isLoading } = useProductsQuery(company.id, {
    category: categoryId === "all" ? undefined : categoryId,
  });
  const cart = useCartForCompany(company.id);
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const total = cart.reduce(
    (sum, i) => sum + i.quantity * Number(i.price ?? 0),
    0,
  );

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

      {itemCount > 0 && (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="fixed inset-x-0 bottom-6 z-20 mx-4 flex  items-center justify-between rounded-2xl bg-primary px-4 py-3.5 text-primary-foreground shadow-float"
        >
          <span className="flex items-center gap-2 text-sm font-extrabold">
            <IconRenderer name="cart_outlined" className="size-4" />
            عرض السلة ({itemCount})
          </span>
          <span className="font-mono text-sm font-extrabold">
            {formatCurrency(String(total))}
          </span>
        </button>
      )}

      <CartReviewDrawer
        company={company}
        open={cartOpen}
        onOpenChange={setCartOpen}
      />
    </div>
  );
}
