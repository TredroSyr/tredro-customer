"use client";

import { useAuthStore } from "@/module/auth/store/auth-store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface OnboardingRouteProps {
  children: React.ReactNode;
}

/** Onboarding requires a signed-in customer, and is skipped once their account is already complete. */
export const OnboardingRoute = ({ children }: OnboardingRouteProps) => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => !!state.accessToken);
  const onboardingCompleted = useAuthStore(
    (state) => state.user?.onboarding_completed ?? false,
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (!isAuthenticated) {
      router.replace("/auth/login");
    } else if (onboardingCompleted) {
      router.replace("/home");
    }
  }, [isMounted, isAuthenticated, onboardingCompleted, router]);

  if (!isMounted) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
        <Image
          src="/tredro/full_logo.svg"
          alt="Tredro Logo"
          width={160}
          height={80}
          className="animate-pulse"
        />
      </div>
    );
  }

  if (!isAuthenticated || onboardingCompleted) return null;

  return <>{children}</>;
};
