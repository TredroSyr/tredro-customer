"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { useCustomerNotificationsStore } from "@/store/use-customer-notifications-store";
import { useAuthStore } from "@/module/auth/store/auth-store";
import { useSignOutMutation } from "@/module/auth/hooks";
import { useThemeStore } from "@/store/use-theme-store";
import { useCartStore } from "@/module/cart/store/use-cart-store";
import { NotificationsDrawer } from "@/components/layout/notifications-drawer";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AppHeaderProps {
  onRefresh?: () => void;
}

export default function AppHeader({ onRefresh }: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/home";

  const unread = useCustomerNotificationsStore(
    (s) => s.notifications.filter((n) => !n.read).length,
  );
  const cartCount = useCartStore((s) =>
    Object.values(s.carts).reduce(
      (sum, items) => sum + items.reduce((n, i) => n + i.quantity, 0),
      0,
    ),
  );
  const user = useAuthStore((s) => s.user);
  const signOutMutation = useSignOutMutation();
  const { theme, toggleTheme } = useThemeStore(
    useShallow((s) => ({
      theme: s.theme,
      toggleTheme: s.toggleTheme,
    })),
  );
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [heroSearch, setHeroSearch] = useState("");
  const avatar = user?.avatar;

  const handleLogout = () => {
    setMenuOpen(false);
    signOutMutation.mutate();
  };

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = heroSearch.trim();
    router.push(q ? `/companies?q=${encodeURIComponent(q)}` : "/companies");
  };

  const profileMenu = (
          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger
              aria-label="الملف الشخصي"
              className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-2xl bg-primary/12 text-primary active:scale-95"
            >
              {avatar && !avatarError ? (
                <Image
                  src={avatar}
                  alt="الملف الشخصي"
                  width={36}
                  height={36}
                  className="size-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <IconRenderer name="user_filled" className="size-4" />
              )}
            </PopoverTrigger>

            <PopoverContent
              align="start"
              className="group w-72 gap-0 p-0 duration-200"
            >
              <div
                className="flex items-center gap-3 p-3 group-data-open:animate-in group-data-open:fade-in-0 group-data-open:slide-in-from-top-1 group-data-open:duration-300"
                style={{ animationDelay: "0ms" }}
              >
                <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-primary/12 text-primary">
                  {avatar && !avatarError ? (
                    <Image
                      src={avatar}
                      alt="الملف الشخصي"
                      width={44}
                      height={44}
                      className="size-full object-cover"
                    />
                  ) : (
                    <IconRenderer name="user_filled" className="size-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold">{user?.name}</p>
                  {user?.phone && (
                    <p
                      className="font-mono text-[11px] text-muted-foreground"
                      dir="ltr"
                    >
                      {user.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-border" />

              <Link
                href="/account"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold group-data-open:animate-in group-data-open:fade-in-0 group-data-open:slide-in-from-top-1 group-data-open:duration-300"
                style={{ animationDelay: "80ms" }}
              >
                <IconRenderer
                  name="user_filled"
                  className="size-4 text-primary"
                />
                عرض الملف الشخصي
              </Link>

              <button
                type="button"
                onClick={toggleTheme}
                className="flex w-full items-center justify-between px-3 py-2.5 group-data-open:animate-in group-data-open:fade-in-0 group-data-open:slide-in-from-top-1 group-data-open:duration-300"
                style={{ animationDelay: "120ms" }}
              >
                <span className="flex items-center gap-2.5 text-xs font-bold">
                  <IconRenderer
                    name={
                      theme === "dark" ? "moon_filled" : "morning_sun_filled"
                    }
                    className="size-4 text-primary"
                  />
                  الوضع {theme === "dark" ? "الليلي" : "النهاري"}
                </span>
                <span
                  className={`relative h-5 w-9 rounded-full transition-colors ${
                    theme === "dark" ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 size-4 rounded-full bg-card shadow transition-all ${
                      theme === "dark" ? "start-0.5" : "end-0.5"
                    }`}
                  />
                </span>
              </button>

              <div className="border-t border-border" />

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setLogoutDialogOpen(true);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-destructive group-data-open:animate-in group-data-open:fade-in-0 group-data-open:slide-in-from-top-1 group-data-open:duration-300"
                style={{ animationDelay: "160ms" }}
              >
                <IconRenderer name="logout_outlined" className="size-4" />
                تسجيل الخروج
              </button>
            </PopoverContent>
          </Popover>
  );

  const notificationsButton = (needsLight: boolean) => (
    <button
      type="button"
      onClick={() => setNotificationsOpen(true)}
      aria-label="الإشعارات"
      className={`relative grid size-9 shrink-0 place-items-center rounded-2xl active:scale-95 ${
        needsLight ? "bg-white/20 text-white" : "bg-secondary text-primary"
      }`}
    >
      <IconRenderer
        name={unread > 0 ? "notification_new_outlined" : "notification_outlined"}
        className="size-4"
      />
      {unread > 0 && (
        <span className="absolute -top-1 -end-1 grid min-w-4 place-items-center rounded-full bg-destructive px-1 font-mono text-[9px] font-bold text-destructive-foreground">
          {unread}
        </span>
      )}
    </button>
  );

  const cartButton = (needsLight: boolean) => (
    <button
      type="button"
      onClick={() => router.push("/companies")}
      aria-label="السلة"
      className={`relative grid size-9 shrink-0 place-items-center rounded-2xl active:scale-95 ${
        needsLight ? "bg-white/20 text-white" : "bg-secondary text-primary"
      }`}
    >
      <IconRenderer name="cart_outlined" className="size-4" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -end-1 grid min-w-4 place-items-center rounded-full bg-destructive px-1 font-mono text-[9px] font-bold text-destructive-foreground">
          {cartCount}
        </span>
      )}
    </button>
  );

  const shared = (
    <>
      <NotificationsDrawer
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />

      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>تسجيل الخروج</DialogTitle>
            <DialogDescription>هل أنت متأكد من تسجيل الخروج؟</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setLogoutDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button type="button" variant="destructive" onClick={handleLogout}>
              تسجيل الخروج
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  if (isHome) {
    return (
      <header className="relative z-30 overflow-hidden rounded-b-[2.25rem] bg-primary pb-5 pt-[max(0.85rem,env(safe-area-inset-top))] shadow-float">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_85%_0%,rgba(255,255,255,0.12),transparent_45%)]" />

        <Image
          src="/tredro/boxes.png"
          alt=""
          width={220}
          height={200}
          aria-hidden
          className="pointer-events-none absolute -bottom-2 -end-6 w-36 object-contain opacity-90 sm:w-44"
        />

        <div className="relative mx-auto flex max-w-md flex-col gap-4 px-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex shrink-0 items-center gap-2">
              {notificationsButton(true)}
              {cartButton(true)}
            </div>

            <Popover open={menuOpen} onOpenChange={setMenuOpen}>
              <PopoverTrigger
                aria-label="الملف الشخصي"
                className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white/20 text-white active:scale-95"
              >
                {avatar && !avatarError ? (
                  <Image
                    src={avatar}
                    alt="الملف الشخصي"
                    width={36}
                    height={36}
                    className="size-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <IconRenderer name="user_filled" className="size-4" />
                )}
              </PopoverTrigger>

              <PopoverContent align="end" className="group w-72 gap-0 p-0 duration-200">
                <div className="flex items-center gap-3 p-3">
                  <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-primary/12 text-primary">
                    {avatar && !avatarError ? (
                      <Image
                        src={avatar}
                        alt="الملف الشخصي"
                        width={44}
                        height={44}
                        className="size-full object-cover"
                      />
                    ) : (
                      <IconRenderer name="user_filled" className="size-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold">{user?.name}</p>
                    {user?.phone && (
                      <p className="font-mono text-[11px] text-muted-foreground" dir="ltr">
                        {user.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t border-border" />

                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold"
                >
                  <IconRenderer name="user_filled" className="size-4 text-primary" />
                  عرض الملف الشخصي
                </Link>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex w-full items-center justify-between px-3 py-2.5"
                >
                  <span className="flex items-center gap-2.5 text-xs font-bold">
                    <IconRenderer
                      name={theme === "dark" ? "moon_filled" : "morning_sun_filled"}
                      className="size-4 text-primary"
                    />
                    الوضع {theme === "dark" ? "الليلي" : "النهاري"}
                  </span>
                  <span
                    className={`relative h-5 w-9 rounded-full transition-colors ${
                      theme === "dark" ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 size-4 rounded-full bg-card shadow transition-all ${
                        theme === "dark" ? "start-0.5" : "end-0.5"
                      }`}
                    />
                  </span>
                </button>

                <div className="border-t border-border" />

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setLogoutDialogOpen(true);
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-destructive"
                >
                  <IconRenderer name="logout_outlined" className="size-4" />
                  تسجيل الخروج
                </button>
              </PopoverContent>
            </Popover>
          </div>

          <Link
            href="/account"
            className="flex items-center gap-2 text-white active:opacity-80"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/20">
              <IconRenderer name="location_filled" className="size-3.5" />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1 text-xs font-bold">
                التوصيل إلى
                <IconRenderer name="chevron_down_outlined" className="size-3.5" />
              </span>
              <span className="block truncate text-[11px] text-white/80">
                {user?.address || "أضف عنوان التوصيل"}
              </span>
            </span>
          </Link>

          <form onSubmit={handleHeroSearchSubmit} className="relative">
            <IconRenderer
              name="search_outlined"
              className="pointer-events-none absolute top-1/2 start-4 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="ابحث عن متجر أو منتج"
              className="h-11 w-full rounded-2xl bg-white ps-10 pe-4 text-sm font-medium text-foreground shadow-float outline-none placeholder:text-muted-foreground"
            />
          </form>
        </div>

        {shared}
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b border-glass-border bg-glass px-4 pb-3 pt-[max(0.85rem,env(safe-area-inset-top))] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <div className="flex shrink-0 items-center gap-2">
          {notificationsButton(false)}
          {profileMenu}
        </div>
        <button type="button" onClick={onRefresh}>
          <Image
            src="/tredro/full_logo.svg"
            alt="logo"
            width={140}
            height={70}
            className="h-auto w-[140px] cursor-pointer object-contain transition-all duration-200 hover:scale-105 active:scale-95"
          />
        </button>
      </div>

      {shared}
    </header>
  );
}
