"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "../types";

interface CartState {
  carts: Record<number, CartItem[]>;
  addItem: (companyId: number, item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (companyId: number, productId: number) => void;
  setQuantity: (companyId: number, productId: number, quantity: number) => void;
  clearCart: (companyId: number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      carts: {},

      addItem: (companyId, item, quantity = 1) => {
        const existing = get().carts[companyId] ?? [];
        const found = existing.find((i) => i.product_id === item.product_id);
        const updated = found
          ? existing.map((i) =>
              i.product_id === item.product_id
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            )
          : [...existing, { ...item, quantity }];

        set({ carts: { ...get().carts, [companyId]: updated } });
      },

      removeItem: (companyId, productId) => {
        const existing = get().carts[companyId] ?? [];
        set({
          carts: {
            ...get().carts,
            [companyId]: existing.filter((i) => i.product_id !== productId),
          },
        });
      },

      setQuantity: (companyId, productId, quantity) => {
        const existing = get().carts[companyId] ?? [];
        if (quantity <= 0) {
          set({
            carts: {
              ...get().carts,
              [companyId]: existing.filter((i) => i.product_id !== productId),
            },
          });
          return;
        }
        set({
          carts: {
            ...get().carts,
            [companyId]: existing.map((i) =>
              i.product_id === productId ? { ...i, quantity } : i,
            ),
          },
        });
      },

      clearCart: (companyId) => {
        const { [companyId]: _removed, ...rest } = get().carts;
        set({ carts: rest });
      },
    }),
    { name: "tredro-customer-cart" },
  ),
);

export function useCartForCompany(companyId: number) {
  return useCartStore((s) => s.carts[companyId] ?? []);
}
