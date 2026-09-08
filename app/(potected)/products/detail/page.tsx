"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/tredro/empty-state";
import { formatCurrency } from "@/lib/format";
import { useProductByIdQuery } from "@/module/products/hooks";
import { useCartStore, useCartForCompany } from "@/module/cart/store/use-cart-store";

function ProductDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const companyId = Number(searchParams.get("company_id"));
  const { data: product, isLoading } = useProductByIdQuery(
    Number.isFinite(companyId) ? companyId : null,
    Number.isFinite(id) ? id : null,
  );
  const addItem = useCartStore((s) => s.addItem);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const cart = useCartForCompany(Number.isFinite(companyId) ? companyId : -1);
  const inCart = cart.find((i) => i.product_id === product?.id);

  if (isLoading) {
    return (
      <div className="space-y-3 pb-6">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pb-6">
        <EmptyState variant="products" size="sm" title="المنتج غير موجود" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      <button
        type="button"
        onClick={() => router.back()}
        className="grid size-9 place-items-center rounded-2xl bg-secondary text-foreground"
      >
        <IconRenderer name="arrow_right_outlined" className="size-4" />
      </button>

      <div className="grid aspect-square w-full place-items-center overflow-hidden rounded-2xl bg-secondary text-muted-foreground">
        {product.primary_image ? (
          <Image
            src={product.primary_image.image}
            alt={product.primary_image.alt_text}
            width={600}
            height={600}
            className="size-full object-cover"
          />
        ) : (
          <IconRenderer name="cart_outlined" className="size-16" />
        )}
      </div>

      <div>
        <h1 className="text-lg font-extrabold">{product.name}</h1>
        <p className="mt-1 font-mono text-base font-extrabold text-primary">
          {product.price ? formatCurrency(product.price.amount) : "السعر غير متاح"}{" "}
          <span className="text-xs font-normal text-muted-foreground">
            / {product.unit.name}
          </span>
        </p>
      </div>

      {product.description && (
        <p className="text-sm leading-6 text-muted-foreground">
          {product.description}
        </p>
      )}

      {product.custom_fields.length > 0 && (
        <div className="space-y-1.5 rounded-2xl border border-border p-3.5">
          {product.custom_fields.map((field) => (
            <div key={field.key} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{field.label}</span>
              <span className="font-bold">{field.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="fixed inset-x-0 bottom-3 z-20 mx-auto max-w-md px-4">
        {inCart ? (
          <div className="flex items-center justify-between rounded-2xl bg-primary px-4 py-3 text-primary-foreground shadow-float">
            <button
              type="button"
              onClick={() =>
                setQuantity(companyId, product.id, inCart.quantity - 1)
              }
              className="grid size-8 place-items-center"
              aria-label="إنقاص الكمية"
            >
              <IconRenderer name="minus_outlined" className="size-4" />
            </button>
            <span className="text-sm font-extrabold">{inCart.quantity}</span>
            <button
              type="button"
              onClick={() =>
                setQuantity(companyId, product.id, inCart.quantity + 1)
              }
              className="grid size-8 place-items-center"
              aria-label="زيادة الكمية"
            >
              <IconRenderer name="plus_outlined" className="size-4" />
            </button>
          </div>
        ) : (
          <Button
            type="button"
            className="w-full rounded-2xl py-4 text-sm font-extrabold"
            onClick={() =>
              addItem(companyId, {
                product_id: product.id,
                product_name: product.name,
                unit_name: product.unit.name,
                price: product.price?.amount ?? null,
                image: product.primary_image?.image ?? null,
              })
            }
          >
            <IconRenderer name="cart_outlined" className="size-4" />
            أضف إلى السلة
          </Button>
        )}
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<Skeleton className="aspect-square w-full rounded-2xl" />}>
      <ProductDetailContent />
    </Suspense>
  );
}
