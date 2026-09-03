"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OrderStatus } from "@/module/orders/types";
import { useOrdersQuery } from "@/module/orders/hooks";
import { OrderFilterTabs } from "@/module/orders/components/order-filter-tabs";
import { OrderCard } from "@/module/orders/components/order-card";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/tredro/empty-state";

export default function OrdersPage() {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const { data: orders = [], isLoading } = useOrdersQuery({
    status: status === "all" ? undefined : status,
  });

  return (
    <div className="space-y-4 pb-6">
      <OrderFilterTabs value={status} onChange={setStatus} />

      {isLoading ? (
        <div className="space-y-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState variant="orders" size="sm" />
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onSelect={() => router.push(`/orders/detail?id=${order.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
