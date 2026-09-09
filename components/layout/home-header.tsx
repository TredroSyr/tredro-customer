"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { useAuthStore } from "@/module/auth/store/auth-store";
import { useCartStore } from "@/module/cart/store/use-cart-store";
import { useCustomerNotificationsStore } from "@/store/use-customer-notifications-store";
import { NotificationsDrawer } from "@/components/layout/notifications-drawer";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 32;

export function HomeHeader() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const unread = useCustomerNotificationsStore(
    (s) => s.notifications.filter((n) => !n.read).length,
  );
  const cartCount = useCartStore((s) =>
    Object.values(s.carts).reduce(
      (sum, items) => sum + items.reduce((n, i) => n + i.quantity, 0),
      0,
    ),
  );

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/companies?q=${encodeURIComponent(q)}` : "/companies");
  };

  const showIllustration = !focused && search.length === 0;
  const collapse = { opacity: scrolled ? 0 : 1, height: scrolled ? 0 : "auto" };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 shadow-float transition-all duration-300",
        scrolled
          ? "rounded-b-2xl bg-primary/80 pt-[max(0.4rem,env(safe-area-inset-top))] backdrop-blur-md"
          : "rounded-b-[2.25rem] bg-primary pt-[max(0.85rem,env(safe-area-inset-top))]",
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_85%_0%,rgba(255,255,255,0.12),transparent_45%)]" />

      <div
        className={cn(
          "relative mx-auto flex max-w-md flex-col px-4 transition-all duration-300",
          scrolled ? "gap-0 pb-1.5" : "gap-4 pb-5",
        )}
      >
        <motion.div
          initial={false}
          animate={collapse}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex items-center justify-between gap-3"
        >
          <div className="min-w-0 text-start">
            <p className="text-xs text-white/80">مرحباً بك</p>
            <p className="truncate text-sm font-extrabold text-white">
              {user?.name || "زائر"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setNotificationsOpen(true)}
              aria-label="الإشعارات"
              className="relative grid size-9 shrink-0 place-items-center rounded-2xl bg-primary-foreground/20  active:scale-95"
            >
              <IconRenderer
                name={
                  unread > 0
                    ? "notification_new_outlined"
                    : "notification_outlined"
                }
                className="size-4"
              />
              {unread > 0 && (
                <span className="absolute -top-1 -end-1 grid min-w-4 place-items-center rounded-full bg-destructive px-1 font-mono text-[9px] font-bold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => router.push("/companies")}
              aria-label="السلة"
              className="relative grid size-9 shrink-0 place-items-center rounded-2xl bg-primary-foreground/20  active:scale-95"
            >
              <IconRenderer name="cart_outlined" className="size-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -end-1 grid min-w-4 place-items-center rounded-full bg-destructive px-1 font-mono text-[9px] font-bold text-destructive-foreground">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="relative z-10">
          <IconRenderer
            name="search_outlined"
            className="pointer-events-none absolute top-1/2 start-2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label="ابحث عن متجر"
            className={cn(
              "rounded-2xl border-none bg-card ps-10 pe-4 text-sm font-medium text-foreground shadow-float outline-none transition-all duration-300",
              scrolled ? "h-9" : "h-11",
            )}
          />

          {showIllustration && (
            <IconRenderer
              name="store_outlined"
              className="pointer-events-none absolute top-1/2 end-4 size-4 -translate-y-1/2 text-primary/40"
            />
          )}
        </form>

        <motion.div
          initial={false}
          animate={collapse}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className=""
        >
          <div className="flex items-center gap-3 rounded-2xl bg-primary-foreground/10 p-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white">توصيل سريع لكل احتياجاتك</p>
              <p className="mt-0.5 text-[11px] text-white/70">
                تسوق من متاجرك المفضلة الآن
              </p>
            </div>
            <Image
              src="/tredro/boxes.png"
              alt=""
              width={90}
              height={80}
              aria-hidden
              className="w-20 shrink-0 object-contain"
            />
          </div>
        </motion.div>
      </div>

      <NotificationsDrawer
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />
    </header>
  );
}
