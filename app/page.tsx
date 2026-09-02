"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/module/auth/store/auth-store";

const RootPage = () => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasOnboarded = useAuthStore((state) => state.hasOnboarded);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isAuthenticated) {
      router.replace("/home");
    } else if (hasOnboarded) {
      router.replace("/auth/login");
    } else {
      router.replace("/onboarding");
    }
  }, [mounted, isAuthenticated, hasOnboarded, router]);

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
