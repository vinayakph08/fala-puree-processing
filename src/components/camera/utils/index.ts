import type { LabValues } from "../capture-confirmation";

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
  const rL = lin(r), gL = lin(g), bL = lin(b);

  // Linear RGB → XYZ (D65)
  const x = rL * 0.4124564 + gL * 0.3575761 + bL * 0.1804375;
  const y = rL * 0.2126729 + gL * 0.7151522 + bL * 0.0721750;
  const z = rL * 0.0193339 + gL * 0.1191920 + bL * 0.9503041;

  // XYZ → Lab
  const f = (t: number) =>
    t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  const fx = f(x / 0.95047);
  const fy = f(y / 1.0);
  const fz = f(z / 1.08883);

  return {
    l: Math.round((116 * fy - 16) * 10) / 10,
    a: Math.round(500 * (fx - fy) * 10) / 10,
    b: Math.round(200 * (fy - fz) * 10) / 10,
  };
}
