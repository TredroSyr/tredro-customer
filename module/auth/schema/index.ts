import * as z from "zod";

export const loginSchema = z.object({
  phone: z
    .string()
    .min(9, "رقم الهاتف غير صالح")
    .regex(/^[0-9+]+$/, "رقم الهاتف غير صالح")
    .refine((val) => val.startsWith("+963"), {
      message: "فقط أرقام الهواتف السورية مسموح بها (تبدأ بـ +963)",
    }),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "الاسم مطلوب"),
    phone: z
      .string()
      .min(9, "رقم الهاتف غير صالح")
      .regex(/^[0-9+]+$/, "رقم الهاتف غير صالح")
      .refine((val) => val.startsWith("+963"), {
        message: "فقط أرقام الهواتف السورية مسموح بها (تبدأ بـ +963)",
      }),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    password_confirmation: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["password_confirmation"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
