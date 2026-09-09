"use client";

import { useLocationPickerMap } from "../lib/use-location-picker-map";

export interface LocationPickerMapProps {
  point: [number, number] | null;
  onPick: (lat: number, lng: number) => void;
}

export function LocationPickerMap({ point, onPick }: LocationPickerMapProps) {
  const { containerRef, mapReady } = useLocationPickerMap({ point, onPick });

  return (
    <div className="relative h-full min-h-[45vh] w-full overflow-hidden rounded-2xl border border-border">
      <div
        ref={containerRef}
        className="map-surface absolute inset-0 h-full w-full"
      />
      {!mapReady && (
        <div className="absolute inset-0 z-1000 flex items-center justify-center bg-background">
          <div
            className="h-8 w-8 animate-spin rounded-full border-4"
            style={{
              borderColor: "var(--border)",
              borderTopColor: "var(--primary)",
            }}
          />
        </div>
      )}
    </div>
  );
}
