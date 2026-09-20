"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { useAuthStore } from "@/module/auth/store/auth-store";
import { useSignOutMutation } from "@/module/auth/hooks";
import { useUnregisterNotificationDeviceMutation } from "@/module/notifications/hooks";
import { FCM_TOKEN_STORAGE_KEY } from "@/module/notifications/hooks/use-register-push-notifications";
import { useThemeStore } from "@/store/use-theme-store";
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

interface ProfileMenuProps {
  triggerClassName?: string;
}

// Staggered entrance for popover rows; the delay is set per row via style.
const ITEM_ANIMATION =
  "group-data-open:animate-in group-data-open:fade-in-0 group-data-open:slide-in-from-top-2 group-data-open:duration-300 group-data-open:fill-mode-backwards";
const MENU_ITEM =
  "group/item flex items-center rounded-2xl px-3 py-3 text-sm font-bold transition-all duration-200 hover:bg-secondary active:scale-[0.97]";
const MENU_ICON =
  "grid size-9 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary transition-transform duration-200 group-hover/item:rotate-6 group-hover/item:scale-110";

const DEFAULT_TRIGGER_CLASSNAME =
  "grid size-9 shrink-0 place-items-center overflow-hidden rounded-2xl bg-primary/12 text-primary active:scale-95";

export function ProfileMenu({ triggerClassName }: ProfileMenuProps) {
  const user = useAuthStore((s) => s.user);
  const signOutMutation = useSignOutMutation();
  const { mutate: unregisterDevice } =
    useUnregisterNotificationDeviceMutation();
  const { theme, toggleTheme } = useThemeStore(
    useShallow((s) => ({
      theme: s.theme,
      toggleTheme: s.toggleTheme,
    })),
  );
  const [avatarError, setAvatarError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const avatar = user?.avatar;

  const handleLogout = () => {
    setMenuOpen(false);

    // This device's push token belongs to whoever is signed in on it (backend
    // §4.3) — unregister it now, and clear the dedup cache so the next sign-in
    // (possibly a different customer) always re-registers instead of assuming
    // "same token = already registered".
    const fcmToken = window.localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
    if (fcmToken) {
      unregisterDevice(fcmToken);
      window.localStorage.removeItem(FCM_TOKEN_STORAGE_KEY);
    }

    signOutMutation.mutate();
  };

  return (
    <>
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger
          aria-label="الملف الشخصي"
          className={triggerClassName ?? DEFAULT_TRIGGER_CLASSNAME}
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
          sideOffset={10}
          className="group w-80 gap-0 overflow-hidden rounded-3xl p-0 shadow-xl duration-300 data-open:zoom-in-90 data-open:slide-in-from-top-4 data-closed:zoom-out-90"
        >
          <div
            className={`flex items-center gap-4 bg-primary/8 p-4 ${ITEM_ANIMATION}`}
            style={{ animationDelay: "0ms" }}
          >
            <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-primary/12 text-primary ring-2 ring-primary/20 group-data-open:animate-in group-data-open:zoom-in-50 group-data-open:duration-500">
              {avatar && !avatarError ? (
                <Image
                  src={avatar}
                  alt="الملف الشخصي"
                  width={56}
                  height={56}
                  className="size-full object-cover"
                />
              ) : (
                <IconRenderer name="user_filled" className="size-6" />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-extrabold">{user?.name}</p>
              {user?.phone && (
                <p
                  className="font-mono text-xs text-muted-foreground"
                  dir="ltr"
                >
                  {user.phone}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-border p-2">
            {/* <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className={`${MENU_ITEM} ${ITEM_ANIMATION}`}
              style={{ animationDelay: "60ms" }}
            >
              <span className="flex items-center gap-3">
                <span className={MENU_ICON}>
                  <IconRenderer name="user_filled" className="size-5" />
                </span>
                عرض الملف الشخصي
              </span>
            </Link> */}

            <button
              type="button"
              onClick={toggleTheme}
              className={`${MENU_ITEM} w-full justify-between ${ITEM_ANIMATION}`}
              style={{ animationDelay: "120ms" }}
            >
              <span className="flex items-center gap-3">
                <span className={MENU_ICON}>
                  <IconRenderer
                    name={
                      theme === "dark" ? "moon_filled" : "morning_sun_filled"
                    }
                    className="size-5"
                  />
                </span>
                الوضع {theme === "dark" ? "الليلي" : "النهاري"}
              </span>
              <span
                className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${
                  theme === "dark" ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-1 size-4 rounded-full bg-card shadow transition-all duration-300 ${
                    theme === "dark" ? "start-1" : "end-1"
                  }`}
                />
              </span>
            </button>

            <div className="mx-2 my-1 border-t border-border" />

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setLogoutDialogOpen(true);
              }}
              className={`${MENU_ITEM} w-full text-destructive hover:bg-destructive/10 ${ITEM_ANIMATION}`}
              style={{ animationDelay: "180ms" }}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`${MENU_ICON} bg-destructive/10 text-destructive`}
                >
                  <IconRenderer name="logout_outlined" className="size-5" />
                </span>
                تسجيل الخروج
              </span>
            </button>
          </div>
        </PopoverContent>
      </Popover>

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
}
