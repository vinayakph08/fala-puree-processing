import { z } from "zod";

// ── Quality control thresholds ────────────────────────────────────────────────
// Single source of truth. Update these values as production standards evolve.

export const QC_THRESHOLDS = {
  /** CIE L*a*b* color — measured by colorimeter */
  color_l: { min: 30, max: 55 },   // Lightness: spinach puree is dark-green
  color_a: { min: -25, max: -5 },  // a*: must stay in the green region (negative)
  color_b: { min: -5, max: 25 },   // b*: slight yellow-green range allowed
  /** Texture — Brix reading (digital refractometer) */
  texture_brix: { min: 3, max: 12 },
  /** Viscosity — Bostwick consistometer (cP) */
  viscosity_cp: { min: 2000, max: 8000 },
  /** Sensory scores — 0–10 scale */
  taste_flavour_score: { min: 6 },
  /** Cooking stress test — 0–10 scale */
  cooking_color_score: { min: 6 },
  cooking_taste_score: { min: 6 },
} as const;

type ThresholdValues = {
  color_l?: number | null;
  color_a?: number | null;
  color_b?: number | null;
  texture_brix?: number | null;
  viscosity_cp?: number | null;
  taste_flavour_score?: number | null;
  cooking_color_score?: number | null;
  cooking_taste_score?: number | null;
};

/**
 * Evaluates test values against QC_THRESHOLDS.
 *
 * Rules:
 *   - Any field is empty (null/undefined)  → "pending"
 *   - All fields filled, any out of range  → "failed"
 *   - All fields filled, all within range  → "passed"
 */
export function computeTestStatus(
  values: ThresholdValues,
): "pending" | "passed" | "failed" {
  const {
    color_l, color_a, color_b,
    texture_brix, viscosity_cp,
    taste_flavour_score,
    cooking_color_score, cooking_taste_score,
  } = values;

  // If any required field is missing, more data is still needed
  if (
    color_l == null || color_a == null || color_b == null ||
    texture_brix == null || viscosity_cp == null ||
    taste_flavour_score == null ||
    cooking_color_score == null || cooking_taste_score == null
  ) {
    return "pending";
  }

  const allPass =
    color_l >= QC_THRESHOLDS.color_l.min && color_l <= QC_THRESHOLDS.color_l.max &&
    color_a >= QC_THRESHOLDS.color_a.min && color_a <= QC_THRESHOLDS.color_a.max &&
    color_b >= QC_THRESHOLDS.color_b.min && color_b <= QC_THRESHOLDS.color_b.max &&
    texture_brix >= QC_THRESHOLDS.texture_brix.min && texture_brix <= QC_THRESHOLDS.texture_brix.max &&
    viscosity_cp >= QC_THRESHOLDS.viscosity_cp.min && viscosity_cp <= QC_THRESHOLDS.viscosity_cp.max &&
    taste_flavour_score >= QC_THRESHOLDS.taste_flavour_score.min &&
    cooking_color_score >= QC_THRESHOLDS.cooking_color_score.min &&
    cooking_taste_score >= QC_THRESHOLDS.cooking_taste_score.min;

  return allPass ? "passed" : "failed";
}

// ── Zod schema ────────────────────────────────────────────────────────────────

export const createQualityTestSchema = z.object({
  batch_id: z.string().min(1, "Batch ID is required"),
  production_line: z.string().nullable().optional(),

  // Standard quality check
  color_l: z.number().nullable().optional(),
  color_a: z.number().nullable().optional(),
  color_b: z.number().nullable().optional(),
  color_image_url: z.string().nullable().optional(),
  texture_brix: z.number().nullable().optional(),
  viscosity_cp: z.number().nullable().optional(),
  taste_flavour_score: z.number().nullable().optional(),

  // Cooking stress test
  cooking_color_score: z.number().nullable().optional(),
  cooking_color_image_url: z.string().nullable().optional(),
  cooking_taste_score: z.number().nullable().optional(),
  cooking_taste_image_url: z.string().nullable().optional(),

  // Notes
  cooking_notes: z.string().nullable().optional(),
});

export type CreateQualityTestFormValues = z.infer<
  typeof createQualityTestSchema
>;
