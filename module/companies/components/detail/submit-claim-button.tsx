"use client";

import { useState } from "react";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { Button } from "@/components/ui/button";
import { ClaimFormDrawer } from "@/module/claims/components/claim-form-drawer";
import { Company } from "../../types";

export function SubmitClaimButton({ company }: { company: Company }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" variant="outline" className="w-full" onClick={() => setOpen(true)}>
        <IconRenderer name="warning_outlined" className="size-4" />
        إرسال مطالبة أو استفسار
      </Button>
      <ClaimFormDrawer
        companyId={company.id}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
