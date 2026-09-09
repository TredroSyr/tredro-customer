"use client";

import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { useAuthStore } from "@/module/auth/store/auth-store";
import { useSignOutMutation } from "@/module/auth/hooks";
import { useThemeStore } from "@/store/use-theme-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);
  const signOutMutation = useSignOutMutation();
  const { theme, toggleTheme } = useThemeStore(
    useShallow((s) => ({ theme: s.theme, toggleTheme: s.toggleTheme })),
  );
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    signOutMutation.mutate();
  };

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
        <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
          <IconRenderer name="user_filled" className="size-6" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-extrabold">{user?.name}</p>
          {user?.phone && (
            <p className="font-mono text-xs text-muted-foreground" dir="ltr">
              {user.phone}
            </p>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex w-full items-center justify-between px-4 py-3.5"
        >
          <span className="flex items-center gap-2.5 text-sm font-bold">
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
      </div>

      <Button
        type="button"
        variant="destructive"
        className="w-full"
        onClick={() => setLogoutDialogOpen(true)}
      >
        <IconRenderer name="logout_outlined" className="size-4" />
        تسجيل الخروج
      </Button>

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
    </div>
  );
}
