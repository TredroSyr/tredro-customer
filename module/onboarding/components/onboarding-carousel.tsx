"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import type { iconName } from "@/assets/icons/iconRenderer/types";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/module/auth/store/auth-store";

interface Slide {
  icon: iconName;
  title: string;
  description: string;
}

const SLIDES: Slide[] = [
  {
    icon: "store_filled",
    title: "تصفح الشركات القريبة منك",
    description: "اكتشف الشركات الموثوقة في منطقتك وتصفح منتجاتها بسهولة.",
  },
  {
    icon: "receipt_filled",
    title: "أرسل طلبك وتابعه لحظة بلحظة",
    description:
      "أضف المنتجات إلى السلة وأرسل طلبك مباشرة، وتابع حالته حتى وصوله.",
  },
  {
    icon: "activity_log_outlined",
    title: "فواتيرك ومطالباتك في مكان واحد",
    description:
      "راجع فواتيرك مع كل شركة، وأرسل استفسار أو مطالبة بخطوات بسيطة.",
  },
];

export function OnboardingCarousel() {
  const router = useRouter();
  const setHasOnboarded = useAuthStore((s) => s.setHasOnboarded);
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;

  const finish = () => {
    setHasOnboarded();
    router.replace("/auth/login");
  };

  const slide = SLIDES[index];

  return (
    <div className="flex h-dvh flex-col bg-background px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))]">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={finish}
          className="text-xs font-bold text-muted-foreground"
        >
          تخطي
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.icon}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <div className="relative flex items-center justify-center">
              <div
                aria-hidden
                className="absolute inset-0 rounded-full bg-primary/10 blur-2xl"
              />
              <div className="relative grid size-28 place-items-center rounded-full bg-primary/12 text-primary">
                <IconRenderer name={slide.icon} className="size-12" />
              </div>
            </div>
            <h1 className="mt-8 text-xl font-extrabold">{slide.title}</h1>
            <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mb-6 flex items-center justify-center gap-1.5">
        {SLIDES.map((s, i) => (
          <span
            key={s.icon}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-primary" : "w-1.5 bg-muted"
            }`}
          />
        ))}
      </div>

      <Button
        type="button"
        onClick={() => (isLast ? finish() : setIndex((i) => i + 1))}
        className="w-full rounded-2xl py-4 text-sm font-extrabold"
      >
        {isLast ? "إنشاء حساب" : "التالي"}
      </Button>
    </div>
  );
}
