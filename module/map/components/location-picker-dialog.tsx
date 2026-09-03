"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LocationPickerMap } from "./location-picker-map";

export interface LocationPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPoint: [number, number] | null;
  onConfirm: (lat: number, lng: number) => void;
}

/** Lets the user pick a point on an embedded map and hands it back via onConfirm, without mutating anything itself. */
export function LocationPickerDialog({
  open,
  onOpenChange,
  initialPoint,
  onConfirm,
}: LocationPickerDialogProps) {
  const [point, setPoint] = useState<[number, number] | null>(initialPoint);

  useEffect(() => {
    if (open) setPoint(initialPoint);
  }, [open, initialPoint]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>حدد موقعك على الخريطة</DialogTitle>
        </DialogHeader>

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

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            disabled={!point}
            onClick={() => {
              if (!point) return;
              onConfirm(point[0], point[1]);
              onOpenChange(false);
            }}
          >
            تأكيد الموقع
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
