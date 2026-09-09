"use client";

import { useEffect, useState } from "react";
import { reverseGeocode, type ReverseGeocodeResult } from "./reverse-geocode";

/** Resolves a point to its address, re-running whenever the point changes and ignoring results from a stale point. */
export function useReverseGeocode(point: [number, number] | null) {
  const [place, setPlace] = useState<ReverseGeocodeResult | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
    if (!point) {
      setPlace(null);
      setIsResolving(false);
      return;
    }

    let cancelled = false;
    setIsResolving(true);
    setPlace(null);

    reverseGeocode(point[0], point[1])
      .then((result) => {
        if (!cancelled) setPlace(result);
      })
      .catch(() => {
        if (!cancelled) setPlace(null);
      })
      .finally(() => {
        if (!cancelled) setIsResolving(false);
      });

    return () => {
      cancelled = true;
    };
  }, [point]);

  return { place, isResolving };
}
