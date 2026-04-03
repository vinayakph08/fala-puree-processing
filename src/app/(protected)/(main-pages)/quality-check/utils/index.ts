import { z } from "zod";

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
