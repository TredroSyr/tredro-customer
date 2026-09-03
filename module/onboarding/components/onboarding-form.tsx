"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, LocateFixed } from "lucide-react";

import { IconRenderer } from "@/assets/icons/iconRenderer";
import { useKeyboardOpen } from "@/hooks/use-keyboard-open";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/module/auth/store/auth-store";
import { ApiErrorResponse } from "@/module/auth/types";
import { LocationPickerDialog } from "@/module/map/components/location-picker-dialog";
import {
  GeoInsecureContextError,
  GeoPermissionError,
  getCurrentPosition,
} from "@/module/map/lib/geo";
import {
  reverseGeocode,
  type ReverseGeocodeResult,
} from "@/module/map/lib/reverse-geocode";
import {
  useBusinessCategoriesQuery,
  useCompleteOnboardingMutation,
} from "../hooks";
import { onboardingSchema, type OnboardingFormValues } from "../schema";

const LOGO_TRANSITION = { duration: 0.35, ease: [0.32, 0.72, 0, 1] } as const;

const STEPS = ["details", "location"] as const;
type Step = (typeof STEPS)[number];

const STEP_HERO_IMAGE: Record<Step, string> = {
  details: "/tredro/details.png",
  location: "/tredro/Locations.png",
};

export function OnboardingForm() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isKeyboardOpen = useKeyboardOpen();
  const { data: categories = [], isLoading: isLoadingCategories } =
    useBusinessCategoriesQuery();

  const [step, setStep] = useState<Step>("details");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [pickedPoint, setPickedPoint] = useState<[number, number] | null>(null);
  const [isResolvingPlace, setIsResolvingPlace] = useState(false);
  const [resolvedPlace, setResolvedPlace] =
    useState<ReverseGeocodeResult | null>(null);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      category: user?.category ?? undefined,
      referral_code: "",
    },
  });

  useEffect(() => {
    if (!pickedPoint) {
      form.setValue("latitude", undefined as unknown as number);
      form.setValue("longitude", undefined as unknown as number);
      form.setValue("governorate", "");
      form.setValue("region", "");
      setResolvedPlace(null);
      return;
    }

    form.setValue("latitude", pickedPoint[0], { shouldValidate: true });
    form.setValue("longitude", pickedPoint[1], { shouldValidate: true });

    let cancelled = false;
    setIsResolvingPlace(true);
    setResolvedPlace(null);

    reverseGeocode(pickedPoint[0], pickedPoint[1])
      .then((result) => {
        if (cancelled) return;
        form.setValue("governorate", result.governorate);
        form.setValue("region", result.region);
        setResolvedPlace(result);
      })
      .catch(() => {
        if (cancelled) return;
        form.setValue("governorate", "");
        form.setValue("region", "");
      })
      .finally(() => {
        if (!cancelled) setIsResolvingPlace(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pickedPoint, form]);

  const onboardingMutation = useCompleteOnboardingMutation({
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.entries(errors).forEach(([field, messages]) => {
          const fieldMap: Record<string, keyof OnboardingFormValues> = {
            category: "category",
            referral_code: "referral_code",
          };
          const mapped = fieldMap[field];
          if (mapped) {
            form.setError(mapped, { message: messages[0] });
          }
        });
      } else {
        toast.error(error.response?.data?.message || "حدث خطأ، حاول مرة أخرى");
      }
    },
  });

  const selectedCategory = form.watch("category");

  const handleUseMyLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const [lat, lng] = await getCurrentPosition();
      setPickedPoint([lat, lng]);
    } catch (error) {
      if (error instanceof GeoPermissionError) {
        toast.error("الرجاء السماح بالوصول إلى الموقع من إعدادات الجهاز");
      } else if (error instanceof GeoInsecureContextError) {
        toast.error("تحديد الموقع متاح فقط عبر اتصال آمن (HTTPS)");
      } else {
        toast.error("تعذر تحديد موقعك، حاول مرة أخرى");
      }
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const goNext = async () => {
    const valid = await form.trigger("category");
    if (valid) setStep("location");
  };

  const goBack = () => setStep("details");

  const onSubmit = (values: OnboardingFormValues) => {
    onboardingMutation.mutate(
      {
        category: values.category,
        referral_code: values.referral_code?.trim() || undefined,
        governorate: values.governorate?.trim() || undefined,
        region: values.region?.trim() || undefined,
        latitude: values.latitude,
        longitude: values.longitude,
      },
      { onSuccess: () => router.replace("/home") },
    );
  };

  return (
    <div className="flex relative h-dvh flex-col bg-primary overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_85%_0%,rgba(255,255,255,0.12),transparent_45%)]" />

      <AnimatePresence initial={false}>
        <motion.div
          key="hero"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isKeyboardOpen ? "16%" : "40%", opacity: 1 }}
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
          <AnimatePresence mode="wait" initial={false}>
            {!isKeyboardOpen && (
              <motion.div
                key={step}
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={LOGO_TRANSITION}
                className="relative w-full max-w-[320px] overflow-hidden"
              >
                <Image
                  src={STEP_HERO_IMAGE[step]}
                  alt="illustration"
                  width={320}
                  height={160}
                  className="relative h-[150px] w-full object-contain"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <div className="relative flex h-[60%] min-h-0 flex-1 flex-col overflow-y-auto scrollbar-hide rounded-t-3xl bg-background px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <div className="mb-4 flex gap-1.5">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  STEPS.indexOf(step) >= i ? "bg-primary" : "bg-secondary",
                )}
              />
            ))}
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-1 flex-col"
            >
              {step === "details" && (
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="category"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold text-primary">
                          نوع النشاط التجاري
                        </FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-2">
                            {isLoadingCategories
                              ? Array.from({ length: 4 }).map((_, i) => (
                                  <Skeleton
                                    key={i}
                                    className="h-11 rounded-2xl"
                                  />
                                ))
                              : categories.map((category) => (
                                  <button
                                    key={category.id}
                                    type="button"
                                    onClick={() =>
                                      form.setValue("category", category.id, {
                                        shouldValidate: true,
                                      })
                                    }
                                    className={cn(
                                      "flex items-center gap-1.5 rounded-2xl border px-3 py-2.5 text-xs font-bold transition-colors",
                                      selectedCategory === category.id
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border bg-secondary text-muted-foreground",
                                    )}
                                  >
                                    {selectedCategory === category.id && (
                                      <IconRenderer
                                        name="tick_outlined"
                                        className="size-3.5 shrink-0"
                                      />
                                    )}
                                    <span className="truncate">
                                      {category.name}
                                    </span>
                                  </button>
                                ))}
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11px] font-bold" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="referral_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold text-primary">
                          كود الإحالة (اختياري)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            dir="ltr"
                            placeholder="REP-XXXX"
                            className="uppercase"
                          />
                        </FormControl>
                        <FormDescription className="text-[11px] font-normal text-muted-foreground">
                          لديك كود إحالة من صديق أو مندوب؟ أدخله للحصول على
                          مزايا إضافية عند تفعيل حسابك.
                        </FormDescription>
                        <FormMessage className="text-[11px] font-bold" />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === "location" && (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 rounded-2xl bg-primary/8 p-3">
                    <IconRenderer
                      name="info_outlined"
                      className="mt-0.5 size-4 shrink-0 text-primary"
                    />
                    <p className="text-[11px] font-bold leading-relaxed text-primary">
                      يُرجى تحديد موقعك بدقة، فهذا الموقع يُعرض للشركة لتتمكن
                      من الوصول إليك وخدمتك بشكل صحيح.
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold text-primary">
                          الموقع
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Button
                              type="button"
                              onClick={() => setPickerOpen(true)}
                              variant="outline"
                              className="w-full !text-primary  border-2 border-dashed border-primary bg-primary/8 py-3 text-xs "
                            >
                              <IconRenderer
                                name="pin_outlined"
                                className="size-4"
                              />
                              {pickedPoint
                                ? "تعديل الموقع"
                                : "حدد الموقع بالضغط على الخريطة"}
                            </Button>
                            <Button
                              type="button"
                              onClick={handleUseMyLocation}
                              disabled={isLoadingLocation}
                              variant="secondary"
                              className="w-full py-3 text-xs !text-primary"
                            >
                              {isLoadingLocation ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <LocateFixed className="size-4" />
                              )}
                              {isLoadingLocation
                                ? "جاري جلب موقعك…"
                                : "استخدم موقعي الحالي"}
                            </Button>
                          </div>
                        </FormControl>
                        <p
                          dir="ltr"
                          className="font-mono text-[11px] text-muted-foreground"
                        >
                          {pickedPoint
                            ? `${pickedPoint[0].toFixed(
                                5,
                              )}, ${pickedPoint[1].toFixed(5)}`
                            : "لم يتم تحديد الموقع بعد"}
                        </p>
                        {isResolvingPlace && (
                          <p className="text-[11px] text-muted-foreground">
                            جاري تحديد المحافظة والمنطقة...
                          </p>
                        )}
                        {!isResolvingPlace &&
                          resolvedPlace &&
                          (resolvedPlace.governorate ||
                            resolvedPlace.region ||
                            resolvedPlace.city) && (
                            <div className="space-y-1 rounded-xl bg-primary/5 p-2.5">
                              <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 text-[11px] font-bold text-primary">
                                {resolvedPlace.governorate && (
                                  <span>{resolvedPlace.governorate}</span>
                                )}
                                {resolvedPlace.region && (
                                  <>
                                    <span className="text-primary/40">/</span>
                                    <span>{resolvedPlace.region}</span>
                                  </>
                                )}
                                {resolvedPlace.city && (
                                  <>
                                    <span className="text-primary/40">/</span>
                                    <span>{resolvedPlace.city}</span>
                                  </>
                                )}
                              </div>
                              {resolvedPlace.displayName && (
                                <p className="text-[10px] leading-relaxed text-muted-foreground">
                                  {resolvedPlace.displayName}
                                </p>
                              )}
                            </div>
                          )}
                        <FormMessage className="text-[11px] font-bold" />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {!isKeyboardOpen && <div className="min-h-6 flex-1" />}

              <div className="space-y-4 pt-4">
                {step === "details" ? (
                  <Button
                    type="button"
                    onClick={goNext}
                    className="flex w-full h-12 rounded-3xl items-center justify-center gap-2"
                  >
                    التالي
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={goBack}
                      aria-label="رجوع"
                      className="h-12 w-12 shrink-0 rounded-3xl !text-primary"
                    >
                      <IconRenderer
                        name="arrow_right_outlined"
                        className="size-4"
                      />
                    </Button>
                    <Button
                      type="submit"
                      disabled={onboardingMutation.isPending}
                      className="flex h-12 flex-2 items-center justify-center gap-2 rounded-3xl"
                    >
                      {onboardingMutation.isPending ? (
                        <IconRenderer name="activity_log_outlined" />
                      ) : (
                        <IconRenderer name="tick_outlined" />
                      )}
                      {onboardingMutation.isPending
                        ? "جاري الحفظ..."
                        : "إكمال التسجيل"}
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>

      <LocationPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        initialPoint={pickedPoint}
        onConfirm={(lat, lng) => setPickedPoint([lat, lng])}
      />
    </div>
  );
}
