"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import { IconRenderer } from "@/assets/icons/iconRenderer";
import { useKeyboardOpen } from "@/hooks/use-keyboard-open";
import TypingText from "@/components/tredro/typing-text";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/tredro/phone-input";
import { useRegisterMutation } from "@/module/auth/hooks";
import { registerSchema, type RegisterFormValues } from "@/module/auth/schema";
import { ApiErrorResponse } from "@/module/auth/types";

const LOGO_TRANSITION = { duration: 0.35, ease: [0.32, 0.72, 0, 1] } as const;

const HERO_TITLES = [
  "اطلب من شركاتك المفضّلة بضغطة",
  "تابع فواتيرك أول بأول",
  "إحصائيات مشترياتك بمكان واحد",
  "تسوّق واطلب بكل سهولة",
];

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const isKeyboardOpen = useKeyboardOpen();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      phone: "",
      password: "",
      password_confirmation: "",
    },
  });

  const registerMutation = useRegisterMutation({
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.entries(errors).forEach(([field, messages]) => {
          const fieldMap: Record<string, keyof RegisterFormValues> = {
            name: "name",
            phone: "phone",
            password: "password",
          };
          const mapped = fieldMap[field];
          if (mapped) {
            form.setError(mapped, { message: messages[0] });
          }
        });
      } else {
        form.setError("phone", {
          message: error.response?.data?.message || "حدث خطأ، حاول مرة أخرى",
        });
      }
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate({
      name: values.name,
      phone: values.phone,
      password: values.password,
    });
  };

  return (
    <div className="flex relative h-dvh flex-col bg-primary overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_85%_0%,rgba(255,255,255,0.12),transparent_45%)]" />

      <AnimatePresence initial={false}>
        <motion.div
          key="hero"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isKeyboardOpen ? "14%" : "30%", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={LOGO_TRANSITION}
          className="relative flex shrink-0 flex-col items-center justify-center overflow-hidden pb-2 pt-[max(2.5rem,env(safe-area-inset-top))]"
        >
          <Image
            src="/tredro/full_logo.svg"
            alt="logo"
            width={140}
            height={70}
            className="relative h-auto w-27.5 object-contain brightness-0 invert"
          />
          <AnimatePresence initial={false}>
            {!isKeyboardOpen && (
              <motion.div
                key="illustration"
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={LOGO_TRANSITION}
                className="relative w-full max-w-[320px] overflow-hidden"
              >
                <Image
                  src="/tredro/boxes.png"
                  alt="welcome"
                  width={320}
                  height={160}
                  className="relative h-auto w-full object-contain"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <div className="relative flex h-[75%] min-h-0 flex-1 flex-col overflow-y-auto scrollbar-hide rounded-t-3xl bg-background px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
        <div className="mx-auto  flex w-full max-w-md flex-1 flex-col">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-1 flex-col"
            >
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold text-primary">
                        اسم المتجر
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="اسم المتجر" />
                      </FormControl>
                      <FormMessage className="text-[11px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold text-primary">
                        رقم الهاتف
                      </FormLabel>
                      <FormControl>
                        <PhoneInput
                          id="phone"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold text-primary">
                        كلمة المرور
                      </FormLabel>
                      <FormControl>
                        <div className="relative" dir="ltr">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label="إظهار كلمة المرور"
                            className="absolute inset-y-0 right-3 grid place-items-center text-muted-foreground"
                            tabIndex={-1}
                          >
                            <IconRenderer
                              name={
                                showPassword
                                  ? "eye_invisible_outlined"
                                  : "eye_visible_outlined"
                              }
                            />
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[11px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold text-primary">
                        تأكيد كلمة المرور
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          dir="ltr"
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] font-bold" />
                    </FormItem>
                  )}
                />
              </div>
              {!isKeyboardOpen && <div className="min-h-6 flex-1" />}
              <div className="space-y-4 pt-4">
                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="flex w-full h-12 rounded-3xl items-center justify-center gap-2"
                >
                  {registerMutation.isPending ? (
                    <IconRenderer name="activity_log_outlined" />
                  ) : (
                    <IconRenderer name="login_outlined" />
                  )}
                  {registerMutation.isPending
                    ? "جاري إنشاء الحساب..."
                    : "إنشاء حساب"}
                </Button>

                <p className="pt-1 text-center text-xs text-muted-foreground">
                  لديك حساب بالفعل؟{" "}
                  <Link href="/auth/login" className="font-bold text-primary">
                    تسجيل الدخول
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
