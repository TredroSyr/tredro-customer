"use client";

import { useAuthStore } from "@/module/auth/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => !!state.accessToken);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);

    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated && isMounted) {
      router.replace("/home");
    }
  }, [isAuthenticated, isMounted, router]);

  if (!isMounted) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
