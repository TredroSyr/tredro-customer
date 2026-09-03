import * as z from "zod";

export const claimSchema = z.object({
  invoice_id: z
    .number({ required_error: "الرجاء اختيار الفاتورة" })
    .min(1, "الرجاء اختيار الفاتورة"),
  quantity: z
    .string()
    .min(1, "الكمية مطلوبة")
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, "أدخل كمية صحيحة"),
  reason: z.enum(["damaged_product", "quantity_shortage", "invoice_error", "other"], {
    required_error: "الرجاء اختيار سبب المطالبة",
  }),
  description: z.string().trim().min(5, "الرجاء وصف المطالبة بتفصيل أكبر"),
});

export type ClaimFormValues = z.infer<typeof claimSchema>;

export const CLAIM_REASON_LABELS: Record<ClaimFormValues["reason"], string> = {
  damaged_product: "منتج تالف",
  quantity_shortage: "نقص في الكمية",
  invoice_error: "خطأ في الفاتورة",
  other: "أخرى",
};
