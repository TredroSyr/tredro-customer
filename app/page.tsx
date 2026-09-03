"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/module/auth/store/auth-store";
import { useOnboardingStatusQuery } from "@/module/onboarding/hooks";

const RootPage = () => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const updateUser = useAuthStore((state) => state.updateUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isError } = useOnboardingStatusQuery(mounted && isAuthenticated);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    if (isError) {
      clearAuth();
      router.replace("/auth/login");
      return;
    }

    if (data) {
      updateUser(data.data.customer);
      router.replace(
        data.data.onboarding_completed ? "/home" : "/auth/onboarding",
      );
    }
  }, [mounted, isAuthenticated, isError, data, updateUser, clearAuth, router]);

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
};

export default RootPage;
