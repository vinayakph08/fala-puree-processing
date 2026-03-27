// @ts-nocheck
// src/app/(protected)/(main-pages)/[feature]/utils/index.ts
//
// Barrel for: Zod schemas only
// Types (IFeatureItem, FeatureFilters, FeatureInsert, etc.) live in src/types/[feature].ts
// FEATURE_KEYS lives in utils/query-keys/index.ts
// Imported by server-actions (server) and hooks (client)

import { z } from "zod";

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

export const createFeatureSchema = z.object({
  farmer_id: z.string().uuid(),
  name: z.string().min(1, { message: "validation.required" }),
  status: z.enum(["active", "completed", "cancelled"]).default("active"),
  notes: z.string().optional(),
});

export const updateFeatureSchema = createFeatureSchema
  .omit({ farmer_id: true })
  .partial();

// Infer form types from schema — never define these manually
export type CreateFeatureFormData = z.infer<typeof createFeatureSchema>;
export type UpdateFeatureFormData = z.infer<typeof updateFeatureSchema>;
