"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/tredro/empty-state";
import { formatCurrency, formatUnit } from "@/lib/format";
import { useProductByIdQuery } from "@/module/products/hooks";
import { useCartStore, useCartForCompany } from "@/module/cart/store/use-cart-store";
import { useCompanyByIdQuery } from "@/module/companies/hooks";
import { CartReviewDrawer } from "@/module/companies/components/detail/cart-review-drawer";
import type { ProductDetailImage } from "@/module/products/types";

const AUTOPLAY_MS = 3500;
const PAUSE_AFTER_TOUCH_MS = 6000;

// Offset of a slide's center from the container's center (RTL-safe).
function offsetToCenter(slide: HTMLElement, container: HTMLElement) {
  const slideRect = slide.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return slideRect.left + slideRect.width / 2 - (containerRect.left + containerRect.width / 2);
}

function ProductImageCarousel({ images }: { images: ProductDetailImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeIndexRef = useRef(0);
  const pausedUntilRef = useRef(0);
  const count = images.length;

  const observeSlide = (node: HTMLDivElement | null, index: number) => {
    slideRefs.current[index] = node;
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    let closestIndex = 0;
    let closestDistance = Infinity;
    slideRefs.current.forEach((slide, index) => {
      if (!slide) return;
      const distance = Math.abs(offsetToCenter(slide, container));
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    activeIndexRef.current = closestIndex;
    setActiveIndex(closestIndex);
  };

  const pauseAutoplay = () => {
    pausedUntilRef.current = Date.now() + PAUSE_AFTER_TOUCH_MS;
  };

  useEffect(() => {
    if (count <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      const container = containerRef.current;
      if (!container || document.hidden || Date.now() < pausedUntilRef.current) return;
      const next = slideRefs.current[(activeIndexRef.current + 1) % count];
      if (!next) return;
      container.scrollBy({ left: offsetToCenter(next, container), behavior: "smooth" });
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [count]);

  if (images.length <= 1) {
    return (
      <div className="grid aspect-16/10 max-h-56 w-full place-items-center overflow-hidden rounded-2xl bg-secondary text-muted-foreground">
        {images[0] ? (
          <Image
            src={images[0].image}
            alt={images[0].alt_text}
            width={600}
            height={600}
            className="size-full object-cover"
          />
        ) : (
          <IconRenderer name="cart_outlined" className="size-16" />
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onTouchStart={pauseAutoplay}
        onPointerDown={pauseAutoplay}
        onWheel={pauseAutoplay}
        className="flex aspect-16/10 max-h-56 w-full snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-2xl bg-secondary [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            ref={(node) => observeSlide(node, index)}
            className="grid h-full w-full flex-none snap-center place-items-center"
          >
            <Image
              src={image.image}
              alt={image.alt_text}
              width={600}
              height={600}
              className="size-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
        {images.map((image, index) => (
          <span
            key={image.id}
            className={`h-1.5 rounded-full transition-all ${
              index === activeIndex ? "w-4 bg-primary" : "w-1.5 bg-background/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/** Mirrors the loaded layout: image, title + price, description, fields card, bottom action bar. */
function ProductDetailSkeleton() {
  return (
    <div className="space-y-4 pb-28">
      <div className="relative">
        <Skeleton className="aspect-16/10 max-h-56 w-full rounded-2xl" />
        <Skeleton className="absolute right-3 top-3 size-9 rounded-2xl bg-background/80" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-11/12" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>

      <div className="space-y-3 rounded-2xl border border-border p-3.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-3 z-20 mx-auto max-w-md px-4">
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  );
}

function ProductDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const companyId = Number(searchParams.get("company_id"));
  const { data: product, isLoading } = useProductByIdQuery(
    Number.isFinite(companyId) ? companyId : null,
    Number.isFinite(id) ? id : null,
  );
  const { data: company } = useCompanyByIdQuery(
    Number.isFinite(companyId) ? companyId : null,
  );
  const addItem = useCartStore((s) => s.addItem);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const cart = useCartForCompany(Number.isFinite(companyId) ? companyId : -1);
  const inCart = cart.find((i) => i.product_id === product?.id);
  const cartItemCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const [cartOpen, setCartOpen] = useState(false);

  if (isLoading) return <ProductDetailSkeleton />;

  if (!product) {
    return (
      <div className="pb-6">
        <EmptyState variant="products" size="sm" title="المنتج غير موجود" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-28">
      <div className="relative">
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-2xl bg-background/80 text-foreground shadow-sm backdrop-blur"
        >
          <IconRenderer name="arrow_right_outlined" className="size-4" />
        </button>

        <ProductImageCarousel
          images={
            product.images.length > 0
              ? [...product.images].sort((a, b) => a.sort_order - b.sort_order)
              : product.primary_image
                ? [{ ...product.primary_image, sort_order: 0 }]
                : []
          }
        />
      </div>

      <div>
        <h1 className="text-lg font-extrabold">{product.name}</h1>
        <p className="mt-1 font-mono text-base font-extrabold text-primary">
          {product.price ? formatCurrency(product.price.amount) : "السعر غير متاح"}{" "}
          <span className="text-xs font-normal text-muted-foreground">
            / {formatUnit(product.unit.name, product.unit.code)}
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
            <div className="flex items-center gap-3">
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

            {company && cartItemCount > 0 && (
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="flex items-center gap-1.5 border-s border-primary-foreground/30 ps-3 text-xs font-extrabold"
              >
                <IconRenderer name="cart_outlined" className="size-4" />
                عرض السلة ({cartItemCount})
              </button>
            )}
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

      {company && (
        <CartReviewDrawer
          company={company}
          open={cartOpen}
          onOpenChange={setCartOpen}
          hideTrigger
        />
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContent />
    </Suspense>
  );
}
