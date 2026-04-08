import type { LabValues } from "../capture-confirmation";
import type {
  CameraSettings,
  ExtendedCapabilities,
  WhiteBalanceMode,
  ExposureMode,
} from "@/types/media-track";

/**
 * Convert sRGB (0–255 each) to CIE L*a*b* (D65 illuminant).
 * Used by both the live camera overlay and the capture confirmation.
 */
export function rgbToLab(r: number, g: number, b: number): LabValues {
  // sRGB → linear light
  const lin = (c: number) => {
    const n = c / 255;
    return n > 0.04045 ? Math.pow((n + 0.055) / 1.055, 2.4) : n / 12.92;
  };
  const rL = lin(r),
    gL = lin(g),
    bL = lin(b);

  // Linear RGB → XYZ (D65)
  const x = rL * 0.4124564 + gL * 0.3575761 + bL * 0.1804375;
  const y = rL * 0.2126729 + gL * 0.7151522 + bL * 0.072175;
  const z = rL * 0.0193339 + gL * 0.119192 + bL * 0.9503041;

  // XYZ → Lab
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f(x / 0.95047);
  const fy = f(y / 1.0);
  const fz = f(z / 1.08883);

  return {
    l: Math.round((116 * fy - 16) * 10) / 10,
    a: Math.round(500 * (fx - fy) * 10) / 10,
    b: Math.round(200 * (fy - fz) * 10) / 10,
  };
}

/**
 * Query what manual camera controls the device supports.
 * Returns null if getCapabilities() is unavailable (e.g. iOS Safari).
 */
export function queryCameraCapabilities(
  track: MediaStreamTrack,
): ExtendedCapabilities | null {
  if (typeof track.getCapabilities !== "function") return null;
  const caps = track.getCapabilities() as ExtendedCapabilities;
  // A device with no extended properties is treated as unsupported
  const hasAny =
    caps.whiteBalanceMode ||
    caps.colorTemperature ||
    caps.exposureMode ||
    caps.exposureTime ||
    caps.iso ||
    caps.sharpness;
  return hasAny ? caps : null;
}

/**
 * Build and apply only the constraints the device actually supports.
 * Silently skips properties absent from capabilities to avoid constraint errors.
 */
export async function applyCameraSettings(
  track: MediaStreamTrack,
  settings: CameraSettings,
  caps: ExtendedCapabilities,
): Promise<void> {
  const advanced: MediaTrackConstraintSet = {};

  if (caps.whiteBalanceMode?.includes(settings.whiteBalanceMode)) {
    advanced.whiteBalanceMode = settings.whiteBalanceMode;
  }
  if (
    settings.whiteBalanceMode === "manual" &&
    caps.colorTemperature &&
    settings.colorTemperature >= caps.colorTemperature.min &&
    settings.colorTemperature <= caps.colorTemperature.max
  ) {
    advanced.colorTemperature = settings.colorTemperature;
  }
  if (caps.exposureMode?.includes(settings.exposureMode)) {
    advanced.exposureMode = settings.exposureMode;
  }
  if (
    settings.exposureMode === "manual" &&
    caps.exposureTime &&
    settings.exposureTime >= caps.exposureTime.min &&
    settings.exposureTime <= caps.exposureTime.max
  ) {
    advanced.exposureTime = settings.exposureTime;
  }
  if (
    caps.iso &&
    settings.iso >= caps.iso.min &&
    settings.iso <= caps.iso.max
  ) {
    advanced.iso = settings.iso;
  }
  if (
    caps.sharpness &&
    settings.sharpness >= caps.sharpness.min &&
    settings.sharpness <= caps.sharpness.max
  ) {
    advanced.sharpness = settings.sharpness;
  }

  if (Object.keys(advanced).length > 0) {
    await track.applyConstraints({ advanced: [advanced] });
  }
}

/** Clamp a value to [min, max] snapped to the nearest step. */
function clampToStep(
  value: number,
  min: number,
  max: number,
  step: number,
): number {
  const clamped = Math.max(min, Math.min(max, value));
  return Math.round((clamped - min) / step) * step + min;
}

/**
 * Build safe default settings from device capabilities.
 * Prefers manual mode with mid-range values for standardized QC.
 * Falls back to "auto" if manual isn't listed as supported.
 */
export function defaultCameraSettings(
  caps: ExtendedCapabilities | null,
): CameraSettings {
  const wbMode: WhiteBalanceMode = caps?.whiteBalanceMode?.includes("manual")
    ? "manual"
    : "auto";

  const colorTemp = caps?.colorTemperature
    ? clampToStep(
        5500,
        caps.colorTemperature.min,
        caps.colorTemperature.max,
        caps.colorTemperature.step,
      )
    : 5500;

  const expMode: ExposureMode = caps?.exposureMode?.includes("manual")
    ? "manual"
    : "auto";

  // ~1/50s expressed in 100μs units = 200
  const exposureTime = caps?.exposureTime
    ? clampToStep(
        200,
        caps.exposureTime.min,
        caps.exposureTime.max,
        caps.exposureTime.step,
      )
    : 200;

  const iso = caps?.iso
    ? clampToStep(100, caps.iso.min, caps.iso.max, caps.iso.step)
    : 100;

  const sharpness = caps?.sharpness
    ? clampToStep(
        Math.round((caps.sharpness.min + caps.sharpness.max) / 2),
        caps.sharpness.min,
        caps.sharpness.max,
        caps.sharpness.step,
      )
    : 0;

  return {
    whiteBalanceMode: wbMode,
    colorTemperature: colorTemp,
    exposureMode: expMode,
    exposureTime,
    iso,
    sharpness,
  };
}
