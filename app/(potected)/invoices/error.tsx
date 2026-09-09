"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/tredro/error-state";

export default function InvoicesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorState error={error} onRetry={reset} />;
}
