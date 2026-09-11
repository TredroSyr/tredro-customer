"use client";

import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { LocationPickerMap } from "./location-picker-map";
import { useReverseGeocode } from "../lib/use-reverse-geocode";

export interface LocationPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPoint: [number, number] | null;
  onConfirm: (lat: number, lng: number) => void;
}

const SNAP_POINTS = [0.6, 0.95];

/** Lets the user pick a point on an embedded map and hands it back via onConfirm, without mutating anything itself. */
export function LocationPickerDialog({
  open,
  onOpenChange,
  initialPoint,
  onConfirm,
}: LocationPickerDialogProps) {
  const [point, setPoint] = useState<[number, number] | null>(initialPoint);
  const { place, isResolving } = useReverseGeocode(open ? point : null);

  useEffect(() => {
    if (open) setPoint(initialPoint);
  }, [open, initialPoint]);

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      showSwipeHandle
      snapPoints={SNAP_POINTS}
      defaultSnapPoint={SNAP_POINTS[1]}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>حدد موقعك على الخريطة</DrawerTitle>
        </DrawerHeader>

        <div
          data-base-ui-swipe-ignore
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 pt-2"
        >
          <LocationPickerMap
            point={point}
            onPick={(lat, lng) => setPoint([lat, lng])}
          />

          <p
            dir="ltr"
            className="text-center font-mono text-[11px] text-muted-foreground"
          >
            {point
              ? `${point[0].toFixed(5)}, ${point[1].toFixed(5)}`
              : "اضغط في أي مكان على الخريطة لتحديد موقعك"}
          </p>

          {isResolving && (
            <p className="text-center text-[11px] text-muted-foreground">
              جاري تحديد العنوان...
            </p>
          )}

          {!isResolving &&
            place &&
            (place.governorate || place.region || place.city || place.displayName) && (
              <div className="space-y-1 rounded-xl bg-primary/5 p-2.5">
                <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 text-[11px] font-bold text-primary">
                  {place.governorate && <span>{place.governorate}</span>}
                  {place.region && (
                    <>
                      <span className="text-primary/40">/</span>
                      <span>{place.region}</span>
                    </>
                  )}
                  {place.city && (
                    <>
                      <span className="text-primary/40">/</span>
                      <span>{place.city}</span>
                    </>
                  )}
                </div>
                {place.displayName && (
                  <p className="text-[10px] leading-relaxed text-muted-foreground">
                    {place.displayName}
                  </p>
                )}
              </div>
            )}
        </div>

        <DrawerFooter>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              إلغاء
            </Button>
            <Button
              type="button"
              disabled={!point}
              className="flex-1"
              onClick={() => {
                if (!point) return;
                onConfirm(point[0], point[1]);
                onOpenChange(false);
              }}
            >
              تأكيد الموقع
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
