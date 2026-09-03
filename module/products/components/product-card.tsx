"use client";

import { useRouter } from "next/navigation";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { formatCurrency } from "@/lib/format";
import { useCartStore, useCartForCompany } from "@/module/cart/store/use-cart-store";
import { Product } from "../types";

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const cart = useCartForCompany(product.company_id);
  const addItem = useCartStore((s) => s.addItem);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const inCart = cart.find((i) => i.product_id === product.id);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background/60">
      <button
        type="button"
        onClick={() => router.push(`/products/detail?id=${product.id}`)}
        className="flex aspect-square w-full items-center justify-center bg-secondary text-muted-foreground"
      >
        <IconRenderer name="cart_outlined" className="size-8" />
      </button>
      <div className="p-2.5">
        <button
          type="button"
          onClick={() => router.push(`/products/detail?id=${product.id}`)}
          className="block w-full text-start"
        >
          <p className="truncate text-xs font-bold">{product.name}</p>
          <p className="mt-1 font-mono text-xs font-extrabold text-primary">
            {formatCurrency(product.price)}
          </p>
        </button>

        <div className="mt-2">
          {inCart ? (
            <div className="flex items-center justify-between rounded-xl bg-primary/12 px-1">
              <button
                type="button"
                onClick={() =>
                  setQuantity(product.company_id, product.id, inCart.quantity - 1)
                }
                className="grid size-7 place-items-center text-primary"
                aria-label="إنقاص الكمية"
              >
                <IconRenderer name="minus_outlined" className="size-3.5" />
              </button>
              <span className="text-xs font-bold text-primary">{inCart.quantity}</span>
              <button
                type="button"
                onClick={() =>
                  setQuantity(product.company_id, product.id, inCart.quantity + 1)
                }
                className="grid size-7 place-items-center text-primary"
                aria-label="زيادة الكمية"
              >
                <IconRenderer name="plus_outlined" className="size-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                addItem(product.company_id, {
                  product_id: product.id,
                  product_name: product.name,
                  unit_name: product.unit_name,
                  price: product.price,
                  image: product.image,
                })
              }
              className="grid h-7 w-full place-items-center rounded-xl bg-primary text-primary-foreground active:scale-95"
              aria-label="إضافة إلى السلة"
            >
              <IconRenderer name="plus_outlined" className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
