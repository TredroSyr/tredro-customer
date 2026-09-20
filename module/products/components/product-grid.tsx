"use client";

import { MotionConfig, motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/tredro/empty-state";
import { Product } from "../types";
import { ProductCard } from "./product-card";

export function ProductGrid({
  products,
  isLoading,
  companyId,
}: {
  products: Product[];
  isLoading: boolean;
  companyId: number;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mt-2">
        <EmptyState variant="products" size="sm" />
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid grid-cols-2 gap-3">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
              delay: Math.min(index, 8) * 0.04,
            }}
          >
            <ProductCard product={product} companyId={companyId} />
          </motion.div>
        ))}
      </div>
    </MotionConfig>
  );
}
