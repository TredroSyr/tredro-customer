import * as z from "zod";

export const onboardingSchema = z.object({
  category: z.number({ required_error: "الرجاء اختيار نوع النشاط" }).int(),
  referral_code: z.string().trim().optional(),
  governorate: z.string().trim().optional(),
  region: z.string().trim().optional(),
  address: z.string().trim().optional(),
  latitude: z.number({
    required_error: "الرجاء تحديد موقعك على الخريطة",
  }),
  longitude: z.number({
    required_error: "الرجاء تحديد موقعك على الخريطة",
  }),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
