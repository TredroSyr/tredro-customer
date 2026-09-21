"use client";

import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { CLAIM_STATUS_META } from "../lib/utils";
import { CLAIM_REASON_LABELS } from "../schema";
import { Claim } from "../types";

export function ClaimCard({ claim }: { claim: Claim }) {
  const meta = CLAIM_STATUS_META[claim.status];

  return (
    <div className="rounded-2xl border border-border bg-background/60 p-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold">{CLAIM_REASON_LABELS[claim.reason]}</span>
        <Badge variant={meta.badge}>{meta.label}</Badge>
      </div>

      <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          فاتورة <span className="font-mono font-bold">{claim.invoice_number}</span>
        </span>
        <span>{formatDate(claim.created_at)}</span>
      </div>

      <p className="mt-2 line-clamp-3 text-xs text-foreground/80">{claim.description}</p>

      <div className="mt-2 flex items-center gap-3">
        {claim.photo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={claim.photo_url}
            alt="صورة المطالبة"
            className="size-14 rounded-xl border border-border object-cover"
          />
        )}
        <span className="text-[11px] text-muted-foreground">
          الكمية: <span className="font-mono font-bold text-foreground">{claim.quantity}</span>
        </span>
      </div>
    </div>
  );
}
