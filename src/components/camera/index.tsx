"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { CameraCapture } from "./camera-capture";

interface CameraProps {
  isOpen: boolean;
  onCapture: (file: File) => void;
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

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className='fixed inset-0 z-50 bg-black'
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <CameraCapture
        onCapture={onCapture}
        onCancel={onCancel}
        facingMode={facingMode}
      />
    </div>,
    document.body,
  );
}
