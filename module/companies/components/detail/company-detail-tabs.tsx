"use client";

import { cn } from "@/lib/utils";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { iconName } from "@/assets/icons/iconRenderer/types";
import { Skeleton } from "@/components/ui/skeleton";

export type CompanyDetailTab =
  | "products"
  | "invoices"
  | "orders"
  | "account"
  | "balance";

const TABS: {
  value: CompanyDetailTab;
  label: string;
  iconFilled: iconName;
  iconOutlined: iconName;
}[] = [
  {
    value: "products",
    label: "المنتجات",
    iconFilled: "category_filled",
    iconOutlined: "category_outlined",
  },
  {
    value: "orders",
    label: "طلباتي",
    iconFilled: "cart_filled",
    iconOutlined: "cart_outlined",
  },
  {
    value: "invoices",
    label: "الفواتير",
    iconFilled: "payment_filled",
    iconOutlined: "payment_outlined",
  },
  {
    value: "balance",
    label: "الرصيد",
    iconFilled: "money_filled",
    iconOutlined: "money_outlined",
  },
];

interface CompanyDetailTabsProps {
  value: CompanyDetailTab;
  onChange: (tab: CompanyDetailTab) => void;
  isLoading?: boolean;
}

export function CompanyDetailTabs({
  value,
  onChange,
  isLoading = false,
}: CompanyDetailTabsProps) {
  if (isLoading) {
    return (
      <div
        className="flex gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        dir="rtl"
      >
        {TABS.map((_, i) => (
          <Skeleton
            key={i}
            className="h-14 w-[45%] shrink-0 rounded-xl border xs:w-[35%]"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      dir="rtl"
    >
      {TABS.map((tab) => {
        const isActive = value === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              "flex shrink-0 cursor-pointer snap-start items-center gap-2 rounded-xl border px-4 py-3 text-right transition-colors",
              "w-[45%] xs:w-[35%]",
              isActive
                ? "border-primary bg-primary/5"
                : "border-border bg-background hover:bg-muted/50",
            )}
          >
            <IconRenderer
              name={isActive ? tab.iconFilled : tab.iconOutlined}
              className={cn(
                "size-4",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            />
            <span
              className={cn(
                "text-sm font-medium whitespace-nowrap",
                isActive ? "text-primary" : "text-foreground",
              )}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
