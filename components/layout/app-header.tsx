"use client";

import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { useCustomerNotificationsStore } from "@/store/use-customer-notifications-store";
import { NotificationsDrawer } from "@/components/layout/notifications-drawer";
import { HomeHeader } from "@/components/layout/home-header";
import { ProfileMenu } from "@/components/layout/profile-menu";

interface AppHeaderProps {
  onRefresh?: () => void;
}

export default function AppHeader({ onRefresh }: AppHeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/home";

  const unread = useCustomerNotificationsStore(
    (s) => s.notifications.filter((n) => !n.read).length,
  );
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  if (isHome) {
    return <HomeHeader />;
  }

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
        name={
          unread > 0 ? "notification_new_outlined" : "notification_outlined"
        }
        className="size-4"
      />
      {unread > 0 && (
        <span className="absolute -top-1 -end-1 grid min-w-4 place-items-center rounded-full bg-destructive px-1 font-mono text-[9px] font-bold text-destructive-foreground">
          {unread}
        </span>
      )}
    </button>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-glass-border bg-glass px-4 pb-3 pt-[max(0.85rem,env(safe-area-inset-top))] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <div className="flex shrink-0 items-center gap-2">
          {notificationsButton(false)}
          <ProfileMenu />
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

      <NotificationsDrawer
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />
    </header>
  );
}
