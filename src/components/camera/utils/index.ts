import type { LabValues } from "../capture-confirmation";
import type {
  CameraSettings,
  ExtendedCapabilities,
  WhiteBalanceMode,
  ExposureMode,
} from "@/types/media-track";

// ---------------------------------------------------------------------------
// Color Space Conversion — Pure Math Functions (no library dependencies)
// Per-pixel operations must be in linear RGB space. Averaging sRGB values
// before conversion introduces systematic perceptual error (see reference doc).
// ---------------------------------------------------------------------------

/** Step 1: Remove sRGB gamma — convert one channel (0–255) to linear light (0–1). */
export function srgbToLinear(value: number): number {
  const n = value / 255;
  return n <= 0.04045 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
}

/** Step 2: Linear RGB (0–1 each) → XYZ (D65 illuminant). Fixed sRGB standard matrix. */
export function linearRGBToXYZ(
  r: number,
  g: number,
  b: number,
): [number, number, number] {
  return [
    0.4124564 * r + 0.3575761 * g + 0.1804375 * b,
    0.2126729 * r + 0.7151522 * g + 0.072175 * b,
    0.0193339 * r + 0.119192 * g + 0.9503041 * b,
  ];
}

/** Step 3: XYZ → CIE L*a*b* (D65 white point). */
export function xyzToLab(
  X: number,
  Y: number,
  Z: number,
): [number, number, number] {
  // D65 reference white
  const fx = _f(X / 0.95047);
  const fy = _f(Y / 1.0);
  const fz = _f(Z / 1.08883);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function _f(t: number): number {
  // (6/29)^3 = 0.008856; linear segment avoids discontinuity near zero
  return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
}

/**
 * Analyze color from raw ImageData pixels.
 *
 * CORRECT pipeline (per reference doc):
 *   linearize each pixel → accumulate in linear space → average → convert once.
 *
 * The a* channel is the primary quality signal for spinach puree:
 *   fresh/high-quality → strongly negative (~-15 to -22)
 *   oxidised/degraded → shifts toward 0 / positive
 */
export function analyzeImageColor(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): LabValues {
  let totalLinR = 0,
    totalLinG = 0,
    totalLinB = 0;
  const pixelCount = width * height;

  for (let i = 0; i < data.length; i += 4) {
    totalLinR += srgbToLinear(data[i]);
    totalLinG += srgbToLinear(data[i + 1]);
    totalLinB += srgbToLinear(data[i + 2]);
  }

  const [X, Y, Z] = linearRGBToXYZ(
    totalLinR / pixelCount,
    totalLinG / pixelCount,
    totalLinB / pixelCount,
  );
  const [L, a, b] = xyzToLab(X, Y, Z);

  return {
    l: Math.round(L * 10) / 10,
    a: Math.round(a * 10) / 10,
    b: Math.round(b * 10) / 10,
  };
}

// ---------------------------------------------------------------------------
// Texture Analysis — Laplacian Variance on Green Channel
// Global luminance stddev conflates lighting gradients with surface roughness.
// Laplacian variance operates in spatial frequency space — it measures
// actual surface changes relative to immediate neighbours.
// Green channel is used because spinach is green-dominant and the Bayer sensor
// has 2× more green pixels (inherently higher quality signal).
// ---------------------------------------------------------------------------

/**
 * Returns the Laplacian variance of the green channel.
 *   Low variance  → smooth, well-blended puree  (high quality)
 *   High variance → grainy/fibrous/unblended    (low quality)
 */
export function analyzeTexture(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): number {
  // Extract green channel as 2D array
  const green: number[][] = [];
  for (let y = 0; y < height; y++) {
    green[y] = [];
    for (let x = 0; x < width; x++) {
      green[y][x] = data[(y * width + x) * 4 + 1]; // index i+1 is green
    }
  }

  // Apply 4-neighbour Laplacian kernel — skip 1-pixel border
  const laplacianValues: number[] = [];
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const lap =
        4 * green[y][x] -
        green[y - 1][x] - // top
        green[y][x - 1] - // left
        green[y][x + 1] - // right
        green[y + 1][x]; // bottom
      laplacianValues.push(lap);
    }
  }

  const n = laplacianValues.length;
  const mean = laplacianValues.reduce((a, v) => a + v, 0) / n;
  return laplacianValues.reduce((acc, v) => acc + (v - mean) ** 2, 0) / n;
}

/**
 * Convert Laplacian variance to a 0–10 texture score.
 * Thresholds are calibration placeholders — measure real samples to set final values.
 *   SMOOTH_THRESHOLD (20)  → score 10 (best)
 *   ROUGH_THRESHOLD  (200) → score 0  (worst)
 */
const SMOOTH_THRESHOLD = 20;
const ROUGH_THRESHOLD = 200;

export function textureVarianceToScore(variance: number): number {
  const raw =
    10 -
    ((variance - SMOOTH_THRESHOLD) / (ROUGH_THRESHOLD - SMOOTH_THRESHOLD)) * 10;
  return Math.round(Math.max(0, Math.min(10, raw)) * 10) / 10;
}

// ---------------------------------------------------------------------------
// Consistency Analysis — Block-wise LAB a* Stddev
// The original 2σ pixel count always returns ~95.4% (mathematical property of
// a normal distribution) — it carries no information about actual uniformity.
// This approach divides the image into a 5×5 grid and measures how much the
// a* value varies between blocks.  Low stddev = uniform; high = patches/streaks.
// ---------------------------------------------------------------------------

/**
 * Returns the standard deviation of mean a* values across a 5×5 block grid.
 *   Near 0  → uniform colour throughout the sample (high quality)
 *   Higher  → patches, streaks, or oxidation spots present
 */
export function analyzeConsistency(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): number {
  const GRID = 5;
  const blockW = Math.floor(width / GRID);
  const blockH = Math.floor(height / GRID);
  const blockAValues: number[] = [];

  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      let totalLinR = 0,
        totalLinG = 0,
        totalLinB = 0,
        count = 0;

      for (let y = row * blockH; y < (row + 1) * blockH; y++) {
        for (let x = col * blockW; x < (col + 1) * blockW; x++) {
          const i = (y * width + x) * 4;
          totalLinR += srgbToLinear(data[i]);
          totalLinG += srgbToLinear(data[i + 1]);
          totalLinB += srgbToLinear(data[i + 2]);
          count++;
        }
      }

      if (count === 0) continue;
      const [X, Y, Z] = linearRGBToXYZ(
        totalLinR / count,
        totalLinG / count,
        totalLinB / count,
      );
      const [, a] = xyzToLab(X, Y, Z);
      blockAValues.push(a);
    }
  }

  const mean = blockAValues.reduce((s, v) => s + v, 0) / blockAValues.length;
  const variance =
    blockAValues.reduce((acc, v) => acc + (v - mean) ** 2, 0) /
    blockAValues.length;
  return Math.round(Math.sqrt(variance) * 10) / 10;
}

// ---------------------------------------------------------------------------
// Legacy helper — kept for the live RGB overlay display (informational only).
// For analysis/scoring, use analyzeImageColor() instead.
// ---------------------------------------------------------------------------

/**
 * Convert a single sRGB triplet (0–255 each) to CIE L*a*b*.
 * @deprecated Use analyzeImageColor() for pixel-array analysis.
 */
export function rgbToLab(r: number, g: number, b: number): LabValues {
  const rL = srgbToLinear(r),
    gL = srgbToLinear(g),
    bL = srgbToLinear(b);
  const [X, Y, Z] = linearRGBToXYZ(rL, gL, bL);
  const [L, a, b_] = xyzToLab(X, Y, Z);
  return {
    l: Math.round(L * 10) / 10,
    a: Math.round(a * 10) / 10,
    b: Math.round(b_ * 10) / 10,
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
 * Apply camera constraints using a two-phase approach.
 *
 * Applying manual WB + colorTemperature in a single applyConstraints() call
 * can produce incorrect frames because the driver may process whiteBalanceMode
 * and colorTemperature sequentially rather than atomically — leaving a few
 * frames in "manual mode with unknown default temperature".
 *
 * Phase 1: reset WB and exposure to "auto" so the pipeline is at a known baseline.
 * Wait:    300ms (~9 frames at 30fps) for the reset to propagate through the pipeline.
 * Phase 2: apply all manual settings atomically on the clean baseline.
 */
export async function applyCameraSettings(
  track: MediaStreamTrack,
  settings: CameraSettings,
  caps: ExtendedCapabilities,
): Promise<void> {
  // Phase 1: reset to auto baseline
  const reset: MediaTrackConstraintSet = {};
  if (caps.whiteBalanceMode?.includes("auto")) reset.whiteBalanceMode = "auto";
  if (caps.exposureMode?.includes("auto")) reset.exposureMode = "auto";
  if (Object.keys(reset).length > 0) {
    await track.applyConstraints({ advanced: [reset] });
  }

  // Wait for the pipeline to drain
  await new Promise<void>((resolve) => setTimeout(resolve, 300));

  // Phase 2: apply the requested settings
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
        6500,
        caps.colorTemperature.min,
        caps.colorTemperature.max,
        caps.colorTemperature.step,
      )
    : 6500;

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
