"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";

/** Damascus — used as the map's default view before a location is picked. */
export const DEFAULT_MAP_CENTER: [number, number] = [33.5138, 36.2765];

const pinIcon = (L: typeof import("leaflet")) =>
  L.divIcon({
    html: `<div class="marker-pin" style="width:40px;height:40px;">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="11" style="fill:var(--primary)" stroke="var(--card)" stroke-width="3" />
        <circle cx="20" cy="20" r="4" fill="var(--card)" />
      </svg>
    </div>`,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

/** A single-marker Leaflet picker: tap anywhere on the map to move the pin. */
export function useLocationPickerMap({
  point,
  onPick,
}: {
  point: [number, number] | null;
  onPick: (lat: number, lng: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;

  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const leafletModule = await import("leaflet");
      const L = leafletModule.default;
      if (cancelled || !containerRef.current || mapRef.current) return;
      leafletRef.current = L;

      const map = L.map(containerRef.current, {
        center: point ?? DEFAULT_MAP_CENTER,
        zoom: point ? 16 : 12,
        zoomControl: false,
        attributionControl: true,
        preferCanvas: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        subdomains: "abc",
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      map.on("click", (event: any) => {
        onPickRef.current(event.latlng.lat, event.latlng.lng);
      });

      mapRef.current = map;
      setMapReady(true);

      requestAnimationFrame(() => {
        mapRef.current?.invalidateSize({ animate: false } as any);
      });
    })();

    return () => {
      cancelled = true;
      markerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
      leafletRef.current = null;
      setMapReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map || !mapReady) return;

    if (!point) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }

    if (markerRef.current) {
      markerRef.current.setLatLng(point);
    } else {
      markerRef.current = L.marker(point, { icon: pinIcon(L) }).addTo(map);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point, mapReady]);

  /** Recenters the map on `point` (e.g. after a GPS fix or an initial value). */
  const flyTo = (target: [number, number], zoom = 16) => {
    mapRef.current?.setView(target, zoom);
  };

  return { containerRef, mapReady, flyTo };
}
