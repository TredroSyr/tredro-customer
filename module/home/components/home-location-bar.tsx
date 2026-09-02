"use client";

import { IconRenderer } from "@/assets/icons/iconRenderer";

// No real geolocation in this prototype — a fixed dummy address stands in
// for the eventual "pick delivery location" flow.
const DUMMY_LOCATION = "دمشق - المزة";

export function HomeLocationBar() {
  return (
    <button
      type="button"
      className="mt-3 flex w-full items-center gap-2 rounded-2xl border border-border bg-card px-3.5 py-2.5 text-start active:scale-[0.99]"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
        <IconRenderer name="location_filled" className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] text-muted-foreground">
          التوصيل إلى
        </span>
        <span className="block truncate text-sm font-bold">
          {DUMMY_LOCATION}
        </span>
      </span>
      <IconRenderer
        name="arrow_down_outlined"
        className="size-4 shrink-0 text-muted-foreground"
      />
    </button>
  );
}
