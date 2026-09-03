"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { formatCurrency } from "@/lib/format";
import { useCartForCompany, useCartStore } from "@/module/cart/store/use-cart-store";
import { useCreateOrderMutation } from "@/module/orders/hooks";
import { Company } from "../../types";

export function CartReviewDrawer({
  company,
  open,
  onOpenChange,
}: {
  company: Company;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const cart = useCartForCompany(company.id);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const [address, setAddress] = useState("دمشق - المزة");
  const [notes, setNotes] = useState("");
  const createOrderMutation = useCreateOrderMutation();

  const total = cart.reduce((sum, i) => sum + i.quantity * Number(i.price), 0);

  const handleSubmit = () => {
    createOrderMutation.mutate(
      {
        company_id: company.id,
        company_name: company.name,
        delivery_address: address,
        notes: notes || undefined,
        lines: cart.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          unit_name: item.unit_name,
          quantity: item.quantity,
          unit_price: item.price,
        })),
      },
      {
        onSuccess: (response) => {
          clearCart(company.id);
          onOpenChange(false);
          toast.success(response.message);
          router.push(`/orders/detail?id=${response.data.order.id}`);
        },
      },
    );
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="up">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>مراجعة الطلب</DrawerTitle>
        </DrawerHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 pt-2">
          <div className="space-y-2">
            {cart.map((item) => (
              <div
                key={item.product_id}
                className="flex items-center justify-between gap-2 rounded-xl bg-secondary px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold">{item.product_name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatCurrency(item.price)} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(company.id, item.product_id, item.quantity - 1)}
                    className="grid size-6 place-items-center rounded-full bg-background text-foreground"
                  >
                    <IconRenderer name="minus_outlined" className="size-3" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(company.id, item.product_id, item.quantity + 1)}
                    className="grid size-6 place-items-center rounded-full bg-background text-foreground"
                  >
                    <IconRenderer name="plus_outlined" className="size-3" />
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
            <label className="text-[11px] font-bold text-primary">عنوان التوصيل</label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-primary">ملاحظات (اختياري)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="أي تفاصيل إضافية عن طلبك..."
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <span className="text-sm font-bold">الإجمالي</span>
            <span className="font-mono text-base font-extrabold text-primary">
              {formatCurrency(String(total))}
            </span>
          </div>
        </div>

        <DrawerFooter>
          <Button
            type="button"
            disabled={cart.length === 0 || createOrderMutation.isPending}
            onClick={handleSubmit}
            className="w-full rounded-2xl py-4 text-sm font-extrabold"
          >
            {createOrderMutation.isPending ? "جاري إرسال الطلب..." : "تأكيد الطلب"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
