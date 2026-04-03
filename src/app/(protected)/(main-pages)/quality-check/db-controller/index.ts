import { createClient } from "@/utils/supabase/server";
import type { DbResult, QualityTest } from "@/types";

export type CreateQualityTestInput = {
  user_id: string;
  batch_id: string;
  production_line: string | null;
  status: "draft" | "pending";
  color_l: number | null;
  color_a: number | null;
  color_b: number | null;
  color_image_url: string | null;
  texture_brix: number | null;
  viscosity_cp: number | null;
  taste_flavour_score: number | null;
  cooking_color_score: number | null;
  cooking_color_image_url: string | null;
  cooking_taste_score: number | null;
  cooking_taste_image_url: string | null;
  cooking_notes: string | null;
};

class QualityCheckController {
  async getQualityTests({
    user_id,
  }: {
    user_id: string;
  }): Promise<DbResult<QualityTest[]>> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("quality_tests")
        .select("*")
        .eq("user_id", user_id)
        .eq("is_deleted", false)
        .order("test_date", { ascending: false });

      if (error) throw new Error(error.message);
      return { data, error: null };
    } catch (error: unknown) {
      return { data: null, error: (error as Error).message };
    }
  }

  async createQualityTest(
    input: CreateQualityTestInput,
  ): Promise<DbResult<QualityTest>> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("quality_tests")
        .insert(input)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return { data, error: null };
    } catch (error: unknown) {
      return { data: null, error: (error as Error).message };
    }
  }
}

export const qualityCheckController = new QualityCheckController();
