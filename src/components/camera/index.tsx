"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { CameraCapture, RgbValues } from "./camera-capture";
import { CaptureConfirmation, LabValues } from "./capture-confirmation";
import { rgbToLab } from "./utils";

export interface CameraProps {
  isOpen: boolean;
  onCapture: (file: File, labValues?: LabValues, textureScore?: number | null) => void;
  onCancel: () => void;
  facingMode?: "user" | "environment";
}

export function Camera({
  isOpen,
  onCapture,
  onCancel,
  facingMode = "environment",
}: CameraProps) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"camera" | "confirm">("camera");
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [labValues, setLabValues] = useState<LabValues | null>(null);
  const [lastCaptureSrc, setLastCaptureSrc] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Reset to camera step whenever the modal opens
  useEffect(() => {
    if (isOpen) setStep("camera");
  }, [isOpen]);

  const [textureScore, setTextureScore] = useState<number | null>(null);

  const handleRawCapture = (file: File, rgb: RgbValues, score: number | null) => {
    const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
    const previewUrl = URL.createObjectURL(file);
    setCapturedFile(file);
    setCapturedPreview(previewUrl);
    setLabValues(lab);
    setTextureScore(score);
    setStep("confirm");
  };

  const handleConfirm = () => {
    if (!capturedFile || !labValues) return;
    if (capturedPreview) setLastCaptureSrc(capturedPreview);
    onCapture(capturedFile, labValues, textureScore);
  };

  const handleRecapture = () => {
    if (capturedPreview) URL.revokeObjectURL(capturedPreview);
    setCapturedFile(null);
    setCapturedPreview(null);
    setLabValues(null);
    setStep("camera");
  };

  const handleCancel = () => {
    if (capturedPreview) URL.revokeObjectURL(capturedPreview);
    setStep("camera");
    onCancel();
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {step === "camera" ? (
        <CameraCapture
          onCapture={handleRawCapture}
          onCancel={handleCancel}
          facingMode={facingMode}
          lastCaptureSrc={lastCaptureSrc ?? undefined}
        />
      ) : (
        capturedPreview &&
        labValues && (
          <CaptureConfirmation
            previewSrc={capturedPreview}
            labValues={labValues}
            onConfirm={handleConfirm}
            onRecapture={handleRecapture}
            onCancel={handleCancel}
          />
        )
      )}
    </div>,
    document.body,
  );
}
