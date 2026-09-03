"use client";

import { useRouter } from "next/navigation";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/tredro/empty-state";
import { useOrdersQuery } from "@/module/orders/hooks";
import { OrderCard } from "@/module/orders/components/order-card";
import { Company } from "../../types";

export function CompanyOrdersTab({ company }: { company: Company }) {
  const router = useRouter();
  const { data: orders = [], isLoading } = useOrdersQuery({ company_id: company.id });

  if (isLoading) {
    return (
      <div className="space-y-2 pb-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="pb-6">
        <EmptyState variant="orders" size="sm" />
      </div>
    );
  }

  return (
    <div className="space-y-2 pb-6">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onSelect={() => router.push(`/orders/detail?id=${order.id}`)}
        />
      ))}
    </div>
  );
}
