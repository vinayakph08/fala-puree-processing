/**
 * Augments the standard MediaTrack types with the extended ImageCapture API
 * properties that are available on Android Chrome but not yet in lib.dom.d.ts.
 *
 * Spec: https://w3c.github.io/mediacapture-image/
 */

export interface RangedCapability {
  min: number;
  max: number;
  step: number;
}

export type WhiteBalanceMode = "auto" | "manual" | "none" | "single-shot";
export type ExposureMode = "auto" | "manual" | "single-shot" | "continuous";
export type FocusMode =
  | "auto"
  | "manual"
  | "single-shot"
  | "continuous"
  | "none";

export interface ExtendedCapabilities extends MediaTrackCapabilities {
  whiteBalanceMode?: WhiteBalanceMode[];
  colorTemperature?: RangedCapability;
  exposureMode?: ExposureMode[];
  exposureTime?: RangedCapability;
  iso?: RangedCapability;
  sharpness?: RangedCapability;
  brightness?: RangedCapability;
}

export interface CameraSettings {
  whiteBalanceMode: WhiteBalanceMode;
  colorTemperature: number;
  exposureMode: ExposureMode;
  exposureTime: number;
  iso: number;
  sharpness: number;
}

declare global {
  interface MediaTrackCapabilities {
    whiteBalanceMode?: WhiteBalanceMode[];
    colorTemperature?: RangedCapability;
    exposureMode?: ExposureMode[];
    exposureTime?: RangedCapability;
    iso?: RangedCapability;
    sharpness?: RangedCapability;
    brightness?: RangedCapability;
  }

  interface MediaTrackConstraintSet {
    whiteBalanceMode?: WhiteBalanceMode;
    colorTemperature?: number;
    exposureMode?: ExposureMode;
    exposureTime?: number;
    iso?: number;
    sharpness?: number;
    brightness?: number;
  }
}
