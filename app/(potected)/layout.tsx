"use client";

import { useCallback, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/guards/protected-route";
import BottomNav, { NAV_H } from "@/layout/bottom-nav";
import AppHeader from "@/components/layout/app-header";
import { PullToRefresh } from "@/components/tredro/pull-to-refresh";
import { useAuthStore } from "@/module/auth/store/auth-store";
import { useRegisterPushNotifications } from "@/module/notifications/hooks/use-register-push-notifications";

const MIN_SPIN_MS = 500;

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);
  useRegisterPushNotifications(isAuthenticated);
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const isDetailPage = pathname?.includes("/detail");
  const isNotificationsPage = pathname?.includes("/notifications");

  const handleRefresh = useCallback(async () => {
    const startedAt = Date.now();
    await queryClient.refetchQueries({ type: "active" });
    const remaining = MIN_SPIN_MS - (Date.now() - startedAt);
    if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
  }, [queryClient]);

  return (
    <ProtectedRoute>
      <div
        style={{ paddingBottom: isDetailPage ? 0 : NAV_H }}
        className="min-h-dvh bg-background"
      >
        <AppHeader />
        <main className={`mx-auto max-w-md ${isNotificationsPage ? "" : "px-4 py-4"}`}>
          <PullToRefresh onRefresh={handleRefresh}>{children}</PullToRefresh>
        </main>
      </div>
      {!isDetailPage && <BottomNav />}
    </ProtectedRoute>
  );
}
