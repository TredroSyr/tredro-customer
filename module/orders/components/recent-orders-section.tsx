"use client";

import { useRouter } from "next/navigation";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useOrdersQuery } from "../hooks";
import { OrderCard } from "./order-card";

export function RecentOrdersSection() {
  const router = useRouter();
  const { data: orders = [], isLoading } = useOrdersQuery();
  const recent = orders.slice(0, 3);

  if (!isLoading && recent.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-extrabold">طلبات حديثة</h2>
        <button
          type="button"
          onClick={() => router.push("/orders")}
          className="text-xs font-bold text-primary"
        >
          عرض الكل
        </button>
      </div>
      <div className="mt-2 space-y-2">
        {isLoading
          ? [1, 2].map((i) => <SkeletonCard key={i} />)
          : recent.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onSelect={() => router.push(`/orders/detail?id=${order.id}`)}
              />
            ))}
      </div>
    </section>
  );
}
