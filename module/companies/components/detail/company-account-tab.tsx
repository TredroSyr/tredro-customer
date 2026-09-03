"use client";

import { useState } from "react";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/tredro/phone-input";
import { useAuthStore } from "@/module/auth/store/auth-store";
import { Company } from "../../types";

export function CompanyAccountTab({ company }: { company: Company }) {
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState("دمشق - المزة");

  return (
    <div className="space-y-4 pb-6">
      <p className="text-xs text-muted-foreground">
        هذه بياناتك الخاصة بالتعامل مع {company.name} فقط.
      </p>

      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-primary">الاسم</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-primary">رقم الهاتف</label>
        <PhoneInput value={phone} onChange={setPhone} />
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-primary">عنوان التوصيل الافتراضي</label>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      <Button type="button" className="w-full">
        <IconRenderer name="success_outlined" className="size-4" />
        حفظ التعديلات
      </Button>
    </div>
  );
}
