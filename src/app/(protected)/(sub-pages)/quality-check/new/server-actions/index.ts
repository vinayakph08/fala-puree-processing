"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

import type { QualityTest } from "@/types";
import { createQualityTestSchema } from "@/app/(protected)/(main-pages)/quality-check/utils";
import { qualityCheckController } from "@/app/(protected)/(main-pages)/quality-check/db-controller";

type ActionResult = { data: QualityTest | null; error: string | null };

export async function createQualityTestAction(
  formData: unknown,
  status: "draft" | "pending",
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Unauthorized" };

  const validated = createQualityTestSchema.safeParse(formData);
  if (!validated.success) {
    return { data: null, error: "Invalid form data. Please check all fields." };
  }

  const { data, error } = await qualityCheckController.createQualityTest({
    user_id: user.id,
    batch_id: validated.data.batch_id,
    production_line: validated.data.production_line ?? null,
    status,
    color_l: validated.data.color_l ?? null,
    color_a: validated.data.color_a ?? null,
    color_b: validated.data.color_b ?? null,
    color_image_url: validated.data.color_image_url ?? null,
    texture_brix: validated.data.texture_brix ?? null,
    viscosity_cp: validated.data.viscosity_cp ?? null,
    taste_flavour_score: validated.data.taste_flavour_score ?? null,
    cooking_color_score: validated.data.cooking_color_score ?? null,
    cooking_color_image_url: validated.data.cooking_color_image_url ?? null,
    cooking_taste_score: validated.data.cooking_taste_score ?? null,
    cooking_taste_image_url: validated.data.cooking_taste_image_url ?? null,
    cooking_notes: validated.data.cooking_notes ?? null,
  });

  if (error) return { data: null, error: "Failed to save quality test." };

  revalidatePath("/quality-check");
  return { data, error: null };
}
