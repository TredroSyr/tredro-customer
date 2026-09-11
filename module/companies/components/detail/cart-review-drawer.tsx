"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { formatCurrency } from "@/lib/format";
import {
  useCartForCompany,
  useCartStore,
} from "@/module/cart/store/use-cart-store";
import { useCreateOrderMutation } from "@/module/orders/hooks";
import { Company } from "../../types";

const SNAP_POINTS = [0.45, 0.94];

export function CartReviewDrawer({
  company,
  open,
  onOpenChange,
  hideTrigger = false,
}: {
  company: Company;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hideTrigger?: boolean;
}) {
  const router = useRouter();
  const cart = useCartForCompany(company.id);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const [notes, setNotes] = useState("");
  const [expanded, setExpanded] = useState(false);
  const createOrderMutation = useCreateOrderMutation();

  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const hasKnownPrices = cart.every((i) => i.price !== null);
  const total = cart.reduce(
    (sum, i) => sum + i.quantity * Number(i.price ?? 0),
    0,
  );

  const handleSubmit = () => {
    createOrderMutation.mutate(
      {
        company_id: company.id,
        notes: notes || undefined,
        lines: cart.map((item) => ({
          product_id: item.product_id,
          quantity: String(item.quantity),
        })),
      },
      {
        onSuccess: (response) => {
          clearCart(company.id);
          onOpenChange(false);
          toast.success(response.message);
          router.push(`/orders/detail?id=${response.data.request.id}`);
        },
        onError: () => toast.error("تعذر إرسال الطلب، يرجى المحاولة مجدداً"),
      },
    );
  };

  return (
    <>
      {!hideTrigger && itemCount > 0 && !open && (
        <div className="fixed inset-x-0 bottom-0 z-20 rounded-t-2xl bg-card p-4 shadow-float">
          <button
            type="button"
            onClick={() => onOpenChange(true)}
            className="flex w-full items-center justify-between rounded-2xl bg-primary px-4 py-3.5 text-primary-foreground"
          >
            <span className="flex items-center gap-2 text-sm font-extrabold">
              <IconRenderer name="cart_outlined" className="size-4" />
              عرض السلة ({itemCount})
            </span>
            <span className="font-mono text-sm font-extrabold">
              {formatCurrency(String(total))}
            </span>
          </button>
        </div>
      )}

      <Drawer
        open={open}
        onOpenChange={(next) => {
          onOpenChange(next);
          if (!next) setExpanded(false);
        }}
        showSwipeHandle
        snapPoints={SNAP_POINTS}
        defaultSnapPoint={SNAP_POINTS[0]}
        onSnapPointChange={(snapPoint) =>
          setExpanded(snapPoint === SNAP_POINTS[1])
        }
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>مراجعة الطلب</DrawerTitle>
          </DrawerHeader>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 pt-2">
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="flex items-center gap-2 text-sm font-bold">
                <IconRenderer
                  name="cart_outlined"
                  className="size-4 text-primary"
                />
                {itemCount} منتج
              </span>
              <span className="font-mono text-base font-extrabold text-primary">
                {formatCurrency(String(total))}
              </span>
            </div>

            {!expanded && (
              <p className="animate-in fade-in-0 flex items-center justify-center gap-1.5 py-1 text-[11px] text-muted-foreground duration-300">
                <IconRenderer name="arrow_up_outlined" className="size-3" />
                اسحب لأعلى لعرض تفاصيل الطلب
              </p>
            )}

            {expanded && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-2 space-y-4 duration-300">
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex items-center justify-between gap-2 rounded-xl bg-secondary px-3 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold">
                          {item.product_name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {item.price
                            ? formatCurrency(item.price)
                            : "السعر غير متاح"}{" "}
                          × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(
                              company.id,
                              item.product_id,
                              item.quantity - 1,
                            )
                          }
                          className="grid size-6 place-items-center rounded-full bg-background text-foreground"
                        >
                          <IconRenderer
                            name="minus_outlined"
                            className="size-3"
                          />
                        </button>
                        <span className="w-5 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(
                              company.id,
                              item.product_id,
                              item.quantity + 1,
                            )
                          }
                          className="grid size-6 place-items-center rounded-full bg-background text-foreground"
                        >
                          <IconRenderer
                            name="plus_outlined"
                            className="size-3"
                          />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(company.id, item.product_id)}
                        className="text-muted-foreground"
                        aria-label="حذف"
                      >
                        <IconRenderer name="bin_outlined" className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-primary">
                    ملاحظات (اختياري)
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="أي تفاصيل إضافية عن طلبك..."
                  />
                </div>

                {!hasKnownPrices && (
                  <p className="text-[10px] text-muted-foreground">
                    الإجمالي أعلاه تقديري (بعض الأسعار غير متاحة).
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground">
                  هذا طلب أولي وليس تأكيداً نهائياً. سيتواصل معك المندوب لتأكيد
                  الأسعار والكميات.
                </p>
              </div>
            )}
          </div>

          <DrawerFooter>
            <Button
              type="button"
              disabled={cart.length === 0 || createOrderMutation.isPending}
              onClick={handleSubmit}
              className="w-full rounded-2xl py-4 text-sm font-extrabold"
            >
              {createOrderMutation.isPending
                ? "جاري إرسال الطلب..."
                : "تأكيد الطلب"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
