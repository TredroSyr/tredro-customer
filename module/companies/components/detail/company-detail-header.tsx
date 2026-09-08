"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { Company } from "../../types";

export function CompanyDetailHeader({ company }: { company: Company }) {
  const router = useRouter();

  return (
    <div className="relative -mx-4 -mt-4">
      <div className="relative flex h-36 w-full items-center justify-center bg-secondary">
        {company.cover ? (
          <Image
            src={company.cover}
            alt={company.name}
            fill
            className="object-cover"
          />
        ) : (
          <IconRenderer name="store_outlined" className="size-12 text-muted-foreground" />
        )}
      </div>

      <button
        type="button"
        onClick={() => router.back()}
        className="absolute top-3 start-3 grid size-9 place-items-center rounded-2xl bg-card/90 text-foreground shadow-float backdrop-blur"
      >
        <IconRenderer name="arrow_right_outlined" className="size-4" />
      </button>

      <div className="absolute -bottom-8 start-4 grid size-16 place-items-center overflow-hidden rounded-2xl border-4 border-background bg-primary/12 text-primary shadow-float">
        {company.logo ? (
          <Image
            src={company.logo}
            alt={company.name}
            width={64}
            height={64}
            className="size-full object-cover"
          />
        ) : (
          <IconRenderer name="store_filled" className="size-7" />
        )}
      </div>
    </div>
  );
}
