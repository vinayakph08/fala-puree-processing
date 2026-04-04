"use client";

import { FC } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface LabValues {
  l: number;
  a: number;
  b: number;
}

// Standard reference LAB values for spinach puree
const SPINACH_PUREE_REFERENCE: LabValues = { l: 42.0, a: -11.5, b: 21.0 };

interface CaptureConfirmationProps {
  previewSrc: string;
  labValues: LabValues;
  onConfirm: () => void;
  onRecapture: () => void;
  onCancel: () => void;
}

function DeltaChip({ delta }: { delta: number }) {
  const abs = Math.abs(delta);
  const sign = delta >= 0 ? "+" : "−";
  const ok = abs <= 5;
  return (
    <span
      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${ok ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}
    >
      {sign}{abs.toFixed(1)}
    </span>
  );
}

export const CaptureConfirmation: FC<CaptureConfirmationProps> = ({
  previewSrc,
  labValues,
  onConfirm,
  onRecapture,
  onCancel,
}) => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4">
        <div className="w-11" />
        <h2 className="text-base font-semibold text-foreground">
          Confirm Color Capture
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="min-h-[44px] min-w-[44px] text-muted-foreground"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Circular image preview */}
      <div className="flex justify-center mt-4 mb-6">
        <div className="relative">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-muted shadow-md">
            <img
              src={previewSrc}
              alt="Captured sample"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-1 right-1 bg-primary rounded-full p-0.5 shadow">
            <CheckCircle2 className="w-6 h-6 text-primary-foreground fill-primary-foreground stroke-primary" />
          </div>
        </div>
      </div>

      {/* Captured Values card */}
      <div className="mx-4 bg-muted/50 rounded-xl px-5 py-4">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-3">
          Captured Values
        </p>
        {/* Header row */}
        <div className="grid grid-cols-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
          <span></span>
          <span className="text-center">L*</span>
          <span className="text-center">a*</span>
          <span className="text-center">b*</span>
        </div>
        {/* Captured row */}
        <div className="grid grid-cols-4 items-center mb-1">
          <span className="text-[10px] text-muted-foreground">Sample</span>
          <span className="text-center text-base font-bold text-foreground">{labValues.l}</span>
          <span className="text-center text-base font-bold text-foreground">{labValues.a}</span>
          <span className="text-center text-base font-bold text-foreground">{labValues.b}</span>
        </div>
        {/* Divider */}
        <div className="border-t border-border my-2" />
        {/* Standard reference row */}
        <div className="grid grid-cols-4 items-center mb-1">
          <span className="text-[10px] text-muted-foreground">Ref</span>
          <span className="text-center text-sm text-muted-foreground">{SPINACH_PUREE_REFERENCE.l}</span>
          <span className="text-center text-sm text-muted-foreground">{SPINACH_PUREE_REFERENCE.a}</span>
          <span className="text-center text-sm text-muted-foreground">{SPINACH_PUREE_REFERENCE.b}</span>
        </div>
        {/* Delta row */}
        <div className="grid grid-cols-4 items-center mt-1">
          <span className="text-[10px] text-muted-foreground">Δ</span>
          <span className="flex justify-center">
            <DeltaChip delta={labValues.l - SPINACH_PUREE_REFERENCE.l} />
          </span>
          <span className="flex justify-center">
            <DeltaChip delta={labValues.a - SPINACH_PUREE_REFERENCE.a} />
          </span>
          <span className="flex justify-center">
            <DeltaChip delta={labValues.b - SPINACH_PUREE_REFERENCE.b} />
          </span>
        </div>
      </div>

      {/* Review text */}
      <p className="text-sm text-muted-foreground text-center px-8 mt-4 leading-relaxed">
        Please review the captured color profile before saving it to the batch
        record. Ensure the lighting was consistent during analysis.
      </p>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Action buttons */}
      <div className="px-4 pb-8 space-y-3">
        <Button
          onClick={onConfirm}
          className="w-full min-h-[52px] rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold tracking-widest uppercase text-sm"
        >
          Confirm Capture
        </Button>
        <Button
          variant="ghost"
          onClick={onRecapture}
          className="w-full min-h-[44px] text-foreground font-medium"
        >
          Recapture Sample
        </Button>
      </div>
    </div>
  );
};
