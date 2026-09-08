"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { formatCurrency, formatDate } from "@/lib/format";
import { useInvoicesQuery } from "@/module/invoices/hooks";
import { useCreateClaimMutation } from "../hooks";
import { claimSchema, CLAIM_REASON_LABELS, type ClaimFormValues } from "../schema";

export function ClaimFormDrawer({
  companyId,
  open,
  onOpenChange,
}: {
  companyId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: invoices = [] } = useInvoicesQuery({ company: companyId });
  const createClaimMutation = useCreateClaimMutation();
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      invoice_id: 0,
      quantity: "",
      reason: "damaged_product",
      description: "",
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const onSubmit = (values: ClaimFormValues) => {
    const invoice = invoices.find((i) => i.id === values.invoice_id);
    if (!invoice) return;

    createClaimMutation.mutate(
      {
        company_id: companyId,
        invoice_id: invoice.id,
        invoice_number: invoice.number,
        quantity: values.quantity,
        reason: values.reason,
        description: values.description,
        photo: photo ?? undefined,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          form.reset();
          setPhoto(null);
          setPhotoPreview(null);
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="up">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>إرسال مطالبة</DrawerTitle>
        </DrawerHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 pt-2">
              <FormField
                control={form.control}
                name="invoice_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-primary">
                      الفاتورة المرتبطة
                    </FormLabel>
                    <div className="space-y-1.5">
                      {invoices.map((invoice) => (
                        <button
                          key={invoice.id}
                          type="button"
                          onClick={() => field.onChange(invoice.id)}
                          className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-start text-xs transition-colors ${
                            field.value === invoice.id
                              ? "border-primary bg-primary/8"
                              : "border-border"
                          }`}
                        >
                          <span>
                            <span className="font-mono font-bold">{invoice.number}</span>
                            <span className="ms-2 text-muted-foreground">
                              {formatDate(invoice.date)}
                            </span>
                          </span>
                          <span className="font-mono font-bold">
                            {formatCurrency(invoice.total_amount)}
                          </span>
                        </button>
                      ))}
                    </div>
                    <FormMessage className="text-[11px] font-bold" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-primary">
                      الكمية المتعلقة بالمطالبة
                    </FormLabel>
                    <FormControl>
                      <Input {...field} inputMode="numeric" placeholder="مثال: 2" />
                    </FormControl>
                    <FormMessage className="text-[11px] font-bold" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-primary">
                      سبب المطالبة
                    </FormLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {(Object.keys(CLAIM_REASON_LABELS) as (keyof typeof CLAIM_REASON_LABELS)[]).map(
                        (key) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => field.onChange(key)}
                            className={`rounded-2xl px-3 py-1.5 text-xs font-bold transition-colors ${
                              field.value === key
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {CLAIM_REASON_LABELS[key]}
                          </button>
                        ),
                      )}
                    </div>
                    <FormMessage className="text-[11px] font-bold" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-primary">
                      وصف المطالبة
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} placeholder="اشرح المشكلة بالتفصيل..." />
                    </FormControl>
                    <FormMessage className="text-[11px] font-bold" />
                  </FormItem>
                )}
              />

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-primary">صورة (اختياري)</label>
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoPreview}
                    alt="معاينة الصورة"
                    className="h-32 w-full rounded-xl object-cover"
                  />
                ) : (
                  <label className="flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border text-muted-foreground">
                    <IconRenderer name="image_outlined" className="size-6" />
                    <span className="text-[11px]">إرفاق صورة</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <DrawerFooter>
              <Button
                type="submit"
                disabled={createClaimMutation.isPending}
                className="w-full rounded-2xl py-4 text-sm font-extrabold"
              >
                {createClaimMutation.isPending ? "جاري الإرسال..." : "إرسال المطالبة"}
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
