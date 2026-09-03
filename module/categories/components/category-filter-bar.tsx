"use client";

import { IconRenderer } from "@/assets/icons/iconRenderer";
import { Category } from "../types";

export function CategoryFilterBar({
  categories,
  value,
  onChange,
}: {
  categories: Category[];
  value: number | "all";
  onChange: (value: number | "all") => void;
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={`flex shrink-0 items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold transition-colors ${
          value === "all"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-muted-foreground"
        }`}
      >
        <IconRenderer name="grid_view_outlined" className="size-3.5" />
        الكل
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
          className={`flex shrink-0 items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold transition-colors ${
            value === category.id
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground"
          }`}
        >
          <IconRenderer name={category.icon} className="size-3.5" />
          {category.name}
        </button>
      ))}
    </div>
  );
}
