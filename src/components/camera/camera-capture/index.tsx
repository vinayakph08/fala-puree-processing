"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  analyzeImageColor,
  analyzeTexture,
  textureVarianceToScore,
  analyzeConsistency,
  queryCameraCapabilities,
  applyCameraSettings,
  defaultCameraSettings,
} from "../utils";
import type { LabValues } from "../capture-confirmation";
import { CameraSettingsPanel } from "../camera-settings";
import type { CameraSettings, ExtendedCapabilities } from "@/types/media-track";

export interface RgbValues {
  r: number;
  g: number;
  b: number;
}

interface CameraCaptureProps {
  onCapture: (
    file: File,
    labValues: LabValues,
    textureScore: number | null,
  ) => void;
  onCancel: () => void;
  lastCaptureSrc?: string;
  facingMode?: "user" | "environment";
  resolution?: { width: number; height: number };
  quality?: number;
}

export const CameraCapture = ({
  onCapture,
  onCancel,
  lastCaptureSrc,
  facingMode = "environment",
  resolution = { width: 1280, height: 720 },
  quality = 0.8,
}: CameraCaptureProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rgbValues, setRgbValues] = useState<RgbValues>({ r: 0, g: 0, b: 0 });
  const [labValues, setLabValues] = useState<LabValues>({ l: 0, a: 0, b: 0 });
  const [textureScore, setTextureScore] = useState<number | null>(null);
  const [consistency, setConsistency] = useState<number | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [capabilities, setCapabilities] = useState<ExtendedCapabilities | null>(
    null,
  );
  const [cameraSettings, setCameraSettings] = useState<CameraSettings>(() =>
    defaultCameraSettings(null),
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analysisCanvasRef = useRef<HTMLCanvasElement>(null);

  const analyzeFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = analysisCanvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sampleW = 80;
    const sampleH = 80;
    canvas.width = sampleW;
    canvas.height = sampleH;
    const vw = video.videoWidth || 320;
    const vh = video.videoHeight || 240;
    ctx.drawImage(
      video,
      (vw - sampleW) / 2,
      (vh - sampleH) / 2,
      sampleW,
      sampleH,
      0,
      0,
      sampleW,
      sampleH,
    );
    const data = ctx.getImageData(0, 0, sampleW, sampleH).data;

    // Live RGB display (informational)
    let totalR = 0,
      totalG = 0,
      totalB = 0;
    const pixelCount = sampleW * sampleH;
    for (let i = 0; i < data.length; i += 4) {
      totalR += data[i];
      totalG += data[i + 1];
      totalB += data[i + 2];
    }
    setRgbValues({
      r: Math.round(totalR / pixelCount),
      g: Math.round(totalG / pixelCount),
      b: Math.round(totalB / pixelCount),
    });

    // Correct color: linearise per-pixel → accumulate → average → convert once
    setLabValues(analyzeImageColor(data, sampleW, sampleH));

    // Correct texture: Laplacian variance on green channel
    setTextureScore(
      textureVarianceToScore(analyzeTexture(data, sampleW, sampleH)),
    );

    // Correct consistency: 5×5 block-wise a* stddev (lower = more uniform)
    setConsistency(analyzeConsistency(data, sampleW, sampleH));
  }, []);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  // Re-apply settings when returning from background (screen lock/unlock).
  // On some Android browsers the track stays "live" but constraints are cleared;
  // on others the track is "ended" and the stream needs a full restart.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      const track = stream?.getVideoTracks()[0];
      if (!track) return;
      if (track.readyState === "ended") {
        // Track was killed by the OS — trigger a full stream restart by
        // stopping all tracks. The existing getUserMedia effect will NOT
        // auto-restart (it runs only once), so we reload the page which
        // is the safest cross-browser approach for a killed camera session.
        stream?.getTracks().forEach((t) => t.stop());
        window.location.reload();
        return;
      }
      if (capabilities) {
        applyCameraSettings(track, cameraSettings, capabilities).catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [stream, capabilities, cameraSettings]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!isLoading && stream) {
      interval = setInterval(analyzeFrame, 500);
    }
    return () => clearInterval(interval);
  }, [isLoading, stream, analyzeFrame]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        setError(null);
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: resolution.width },
            height: { ideal: resolution.height },
          },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          const video = videoRef.current;
          video.srcObject = mediaStream;
          const handleCanPlay = () => {
            video
              .play()
              .then(() => {
                setIsLoading(false);
                const track = mediaStream.getVideoTracks()[0];
                if (track) {
                  const caps = queryCameraCapabilities(track);
                  setCapabilities(caps);
                  const defaults = defaultCameraSettings(caps);
                  setCameraSettings(defaults);
                  if (caps) {
                    applyCameraSettings(track, defaults, caps).catch(() => {});
                  }
                }
              })
              .catch(() => setIsLoading(false));
          };
          video.addEventListener("canplay", handleCanPlay, { once: true });
          setTimeout(() => setIsLoading(false), 3000);
        }
      } catch {
        setError("Camera access failed. Please check permissions.");
        setIsLoading(false);
        toast.error("Camera Access Failed");
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const now = new Date();
        const ts =
          now.getFullYear() +
          String(now.getMonth() + 1).padStart(2, "0") +
          String(now.getDate()).padStart(2, "0") +
          "-" +
          String(now.getHours()).padStart(2, "0") +
          String(now.getMinutes()).padStart(2, "0") +
          String(now.getSeconds()).padStart(2, "0");
        const file = new File([blob], `puree-${ts}.jpg`, {
          type: "image/jpeg",
        });
        stream?.getTracks().forEach((t) => t.stop());
        onCapture(file, labValues, textureScore);
      },
      "image/jpeg",
      quality,
    );
  };

  const handleCancel = () => {
    stream?.getTracks().forEach((t) => t.stop());
    onCancel();
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-camera-bg p-6 gap-4">
        <p className="text-destructive text-center font-medium">{error}</p>
        <Button
          onClick={handleCancel}
          variant="outline"
          className="min-h-[44px]"
        >
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="min-h-[44px] min-w-[44px] text-foreground"
        >
          <X className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <p className="text-[10px] font-bold tracking-widest text-primary uppercase">
            Analysis Mode
          </p>
          <h2 className="text-xl font-bold text-foreground">
            Puree Parameters
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSettingsOpen(true)}
          className="min-h-[44px] min-w-[44px] text-foreground"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Viewfinder */}
      <div className="flex-1 flex flex-col px-4 overflow-hidden">
        <div className="relative flex-1 rounded-2xl overflow-hidden bg-black min-h-0">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={cn(
              "w-full h-full object-cover",
              isLoading && "opacity-0",
            )}
          />

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white/70 animate-pulse text-sm">
                Starting camera...
              </p>
            </div>
          )}

          {/* Corner brackets */}
          {!isLoading && (
            <>
              <div className="absolute top-5 left-5 w-7 h-7 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-5 right-5 w-7 h-7 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-5 left-5 w-7 h-7 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-5 right-5 w-7 h-7 border-b-2 border-r-2 border-primary" />
            </>
          )}

          {/* Overlay metric cards */}
          {!isLoading && (
            <>
              {/* RGB Stream — top left */}
              <div className="absolute top-10 left-10 bg-white/90 rounded-lg px-3 py-2 shadow-sm max-w-[155px]">
                <p className="text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
                  RGB Stream
                </p>
                <p className="text-sm font-bold text-foreground mt-0.5">
                  R: {rgbValues.r} G: {rgbValues.g} B: {rgbValues.b}
                </p>
              </div>

              {/* Lab Color Values — top right */}
              <div className="absolute top-10 right-10 bg-white/90 rounded-lg px-3 py-2 shadow-sm text-right">
                <p className="text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
                  Lab Color
                </p>
                <p className="text-sm font-bold text-foreground mt-0.5 leading-snug">
                  L: {labValues.l}
                </p>
                <p className="text-sm font-bold text-foreground leading-snug">
                  a: {labValues.a} b: {labValues.b}
                </p>
              </div>

              {/* Consistency — bottom left */}
              <div className="absolute bottom-10 left-10 bg-white/90 rounded-lg px-3 py-2 shadow-sm">
                <p className="text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
                  Consistency
                </p>
                <p className="text-sm font-bold text-foreground mt-0.5">
                  {consistency !== null ? `±${consistency} a*` : "—"}
                </p>
              </div>

              {/* Texture Score — bottom right */}
              <div className="absolute bottom-10 right-10 bg-white/90 rounded-lg px-3 py-2 shadow-sm text-right">
                <p className="text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
                  Texture Score
                </p>
                <p className="text-2xl font-bold text-foreground leading-tight">
                  {textureScore ?? "—"}
                </p>
                <p className="text-[10px] text-muted-foreground">Target: 8.0</p>
              </div>
            </>
          )}
        </div>

        {/* Tip text pill */}
        <div className="bg-white rounded-full px-5 py-3 my-3 shadow-sm">
          <p className="text-sm text-foreground text-center font-medium leading-snug">
            Align the puree sample within the frame for Color/Texture analysis.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-8 pb-8 pt-1">
        {/* Last capture thumbnail */}
        {lastCaptureSrc ? (
          <img
            src={lastCaptureSrc}
            alt="Last capture"
            className="w-12 h-12 rounded-xl object-cover border-2 border-border shadow-sm"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-muted border border-border" />
        )}

        {/* Shutter button */}
        <Button
          onClick={handleCapture}
          disabled={isLoading}
          size="icon"
          className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md ring-4 ring-primary/20 disabled:opacity-50"
        />

        {/* Cancel / retake icon */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="w-12 h-12 min-h-[44px] min-w-[44px] text-muted-foreground"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>

      {/* Hidden canvases */}
      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={analysisCanvasRef} className="hidden" />

      {/* Camera settings sheet */}
      <CameraSettingsPanel
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={cameraSettings}
        capabilities={capabilities}
        onApply={(newSettings) => {
          setCameraSettings(newSettings);
          const track = stream?.getVideoTracks()[0];
          if (track && capabilities) {
            applyCameraSettings(track, newSettings, capabilities).catch(() =>
              toast.error("Failed to apply camera settings"),
            );
          }
        }}
      />
    </div>
  );
};
