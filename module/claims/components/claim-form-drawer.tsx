"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/toast";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/tredro/empty-state";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/format";
import { useInvoicesQuery } from "@/module/invoices/hooks";
import { INVOICE_STATUS_META } from "@/module/invoices/lib/utils";
import { useCreateClaimMutation } from "../hooks";
import {
  CameraPermissionError,
  isNativeCamera,
  pickNativePhoto,
  type PhotoSource,
} from "../lib/photo";
import { claimSchema, CLAIM_REASON_LABELS, type ClaimFormValues } from "../schema";

const PHOTO_SOURCES = [
  { source: "camera", label: "التقاط صورة", icon: "image_outlined" },
  { source: "gallery", label: "من المعرض", icon: "gallery_outlined" },
] as const;

export function ClaimFormDrawer({
  companyId,
  open,
  onOpenChange,
}: {
  companyId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: invoices = [], isLoading: invoicesLoading } = useInvoicesQuery({
    company: companyId,
  });
  const createClaimMutation = useCreateClaimMutation();
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      invoice_id: 0,
      quantity: "",
      reason: "damaged_product",
      description: "",
    },
  });

  const setPickedPhoto = (file: File | null) => {
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
    setPhoto(file);
  };

  // Web fallback: the browser asks for camera access itself when the capture input opens.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) setPickedPhoto(file);
  };

  const handlePickPhoto = async (source: PhotoSource) => {
    if (!isNativeCamera()) {
      (source === "camera" ? cameraInputRef : galleryInputRef).current?.click();
      return;
    }
    try {
      const file = await pickNativePhoto(source);
      if (file) setPickedPhoto(file);
    } catch (err) {
      toast.error(
        err instanceof CameraPermissionError
          ? "تم رفض إذن الكاميرا. فعّله من إعدادات التطبيق لالتقاط صورة"
          : "تعذّر الحصول على الصورة، حاول مرة أخرى",
      );
    }
  };

  // A lone invoice is the obvious choice — no reason to make the user tap it.
  useEffect(() => {
    if (open && invoices.length === 1 && !form.getValues("invoice_id")) {
      form.setValue("invoice_id", invoices[0].id);
    }
  }, [open, invoices, form]);

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
          setPickedPhoto(null);
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
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
                    {invoicesLoading ? (
                      <div className="h-24 animate-pulse rounded-2xl bg-secondary" />
                    ) : invoices.length === 0 ? (
                      <EmptyState variant="invoices" size="sm" />
                    ) : (
                      <div
                        role="radiogroup"
                        className="max-h-56 space-y-2 overflow-y-auto"
                      >
                        {invoices.map((invoice) => {
                          const selected = field.value === invoice.id;
                          const meta = INVOICE_STATUS_META[invoice.status];
                          return (
                            <button
                              key={invoice.id}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              onClick={() => field.onChange(invoice.id)}
                              className={cn(
                                "flex w-full items-center gap-3 rounded-2xl border p-3 text-start transition-colors",
                                selected
                                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                                  : "border-border bg-background/60 hover:border-primary/50",
                              )}
                            >
                              <span
                                className={cn(
                                  "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                                  selected
                                    ? "border-primary bg-primary"
                                    : "border-muted-foreground/40",
                                )}
                              >
                                {selected && (
                                  <span className="size-2 rounded-full bg-primary-foreground" />
                                )}
                              </span>
                              <span className="min-w-0 flex-1 space-y-1">
                                <span className="flex items-center justify-between gap-2">
                                  <span className="font-mono text-xs font-bold">
                                    {invoice.number}
                                  </span>
                                  <Badge variant={meta.badge}>{meta.label}</Badge>
                                </span>
                                <span className="flex items-center justify-between text-[11px] text-muted-foreground">
                                  <span>
                                    {formatDate(invoice.date)} · {invoice.line_count} أصناف
                                  </span>
                                  <span className="font-mono text-xs font-bold text-foreground">
                                    {formatCurrency(invoice.total_amount)}
                                  </span>
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
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
                <span className="text-[11px] font-bold text-primary">صورة (اختياري)</span>
                {photoPreview ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoPreview}
                      alt="معاينة الصورة"
                      className="h-40 w-full rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPickedPhoto(null)}
                      aria-label="إزالة الصورة"
                      className="absolute end-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white"
                    >
                      <IconRenderer name="close_outlined" className="size-4" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {PHOTO_SOURCES.map(({ source, label, icon }) => (
                      <button
                        key={source}
                        type="button"
                        onClick={() => handlePickPhoto(source)}
                        className="flex h-20 flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50"
                      >
                        <IconRenderer name={icon} className="size-6" />
                        <span className="text-[11px]">{label}</span>
                      </button>
                    ))}
                  </div>
                )}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleInputChange}
                />
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleInputChange}
                />
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
