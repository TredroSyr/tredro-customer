"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import TruckScene from "@/module/auth/components/truck-scene";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { useKeyboardOpen } from "@/hooks/use-keyboard-open";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { MockApiError } from "@/module/auth/api";

const SHEET_TRANSITION = { duration: 0.35, ease: [0.32, 0.72, 0, 1] } as const;

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
    onError: (error: MockApiError) => {
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
    registerMutation.mutate(values);
  };

  return (
    <div className="relative flex flex-col overflow-hidden bg-primary">
      <AnimatePresence mode="wait" initial={false}>
        {!isKeyboardOpen && (
          <motion.div
            key="truck-scene"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={SHEET_TRANSITION}
            className="relative overflow-hidden"
          >
            <TruckScene />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      <Drawer open={true} modal={false} swipeDirection="down">
        <DrawerContent className="relative z-10 -mt-6 max-w-none rounded-t-[2rem] border-0 bg-card px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 shadow-sheet focus:outline-none">
          <div className="mx-auto max-w-md">
            <AnimatePresence initial={false}>
              <motion.div
                key="logo"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={SHEET_TRANSITION}
                className="flex items-center justify-center overflow-hidden pt-3"
              >
                <Image
                  src="/tredro/full_logo.svg"
                  alt="logo"
                  width={140}
                  height={70}
                  className="h-auto w-27.5 object-contain pb-3"
                />
              </motion.div>
            </AnimatePresence>

            <h1 className="mt-1 text-2xl font-extrabold leading-tight">
              إنشاء حساب جديد
            </h1>
            <p className="mt-1.5 text-xs text-muted-foreground">
              أنشئ حسابك للبدء بتصفح الشركات وإرسال طلباتك.
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-5 space-y-3"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold text-primary">
                        الاسم الكامل
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="مثال: أحمد الحلبي" />
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

                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-extrabold text-primary-foreground shadow-float active:scale-[0.98] disabled:opacity-70"
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
              </form>
            </Form>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              لديك حساب بالفعل؟{" "}
              <Link href="/auth/login" className="font-bold text-primary">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default RegisterPage;
