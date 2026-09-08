"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { formatCurrency } from "@/lib/format";
import { useCartStore, useCartForCompany } from "@/module/cart/store/use-cart-store";
import { Product } from "../types";

export function ProductCard({
  product,
  companyId,
}: {
  product: Product;
  companyId: number;
}) {
  const router = useRouter();
  const cart = useCartForCompany(companyId);
  const addItem = useCartStore((s) => s.addItem);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const inCart = cart.find((i) => i.product_id === product.id);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background/60">
      <div className="relative aspect-square w-full">
        <button
          type="button"
          onClick={() => router.push(`/products/detail?id=${product.id}&company_id=${companyId}`)}
          className="flex size-full items-center justify-center bg-secondary text-muted-foreground"
        >
          {product.primary_image ? (
            <Image
              src={product.primary_image.image}
              alt={product.primary_image.alt_text}
              width={200}
              height={200}
              className="size-full object-cover"
            />
          ) : (
            <IconRenderer name="cart_outlined" className="size-8" />
          )}
        </button>

        <div className="absolute inset-x-1.5 bottom-1.5">
          {inCart ? (
            <div className="flex items-center justify-between rounded-full bg-background/95 px-1 py-0.5 shadow-sm backdrop-blur">
              <button
                type="button"
                onClick={() => setQuantity(companyId, product.id, inCart.quantity - 1)}
                className="grid size-6 place-items-center text-primary"
                aria-label="إنقاص الكمية"
              >
                <IconRenderer name="minus_outlined" className="size-3" />
              </button>
              <span className="text-xs font-bold text-primary">{inCart.quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(companyId, product.id, inCart.quantity + 1)}
                className="grid size-6 place-items-center text-primary"
                aria-label="زيادة الكمية"
              >
                <IconRenderer name="plus_outlined" className="size-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                addItem(companyId, {
                  product_id: product.id,
                  product_name: product.name,
                  unit_name: product.unit.name,
                  price: product.price?.amount ?? null,
                  image: product.primary_image?.image ?? null,
                })
              }
              className="ms-auto grid size-7 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm active:scale-95"
              aria-label="إضافة إلى السلة"
            >
              <IconRenderer name="plus_outlined" className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-2.5">
        <button
          type="button"
          onClick={() => router.push(`/products/detail?id=${product.id}&company_id=${companyId}`)}
          className="block w-full text-start"
        >
          <p className="truncate text-xs font-bold">{product.name}</p>
          <p className="mt-1 font-mono text-xs font-extrabold text-primary">
            {product.price ? formatCurrency(product.price.amount) : "السعر غير متاح"}
          </p>
        </button>
      </div>
    </div>
  );
}
