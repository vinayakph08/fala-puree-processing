import { createClient } from "@/utils/supabase/server";
import type { DbResult, QualityTest, QualityTestListItem, PaginatedQualityTests } from "@/types";

export type CreateQualityTestInput = {
  user_id: string;
  batch_id: string;
  production_line: string | null;
  status: "draft" | "pending" | "passed" | "failed";
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
  cooking_notes: string | null;
};

export type SearchQualityTestsInput = {
  search_term?: string | null;
  status?: string | null;
  sort_by?: string;
  sort_dir?: "ASC" | "DESC";
  page?: number;
  limit?: number;
};

class QualityCheckController {
  async searchQualityTests(
    input: SearchQualityTestsInput,
  ): Promise<DbResult<PaginatedQualityTests>> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.rpc("search_quality_tests", {
        p_search_term: input.search_term ?? null,
        p_status: input.status ?? null,
        p_sort_by: input.sort_by ?? "test_date",
        p_sort_dir: input.sort_dir ?? "DESC",
        p_page: input.page ?? 0,
        p_limit: input.limit ?? 20,
      });

      if (error) throw new Error(error.message);

      const result = data as { data: PaginatedQualityTests | null; error: string | null };
      if (result.error) return { data: null, error: result.error };
      return { data: result.data, error: null };
    } catch (error: unknown) {
      return { data: null, error: (error as Error).message };
    }
  }

  async getQualityTestById(id: string): Promise<DbResult<QualityTest>> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("quality_tests")
        .select("*")
        .eq("id", id)
        .eq("is_deleted", false)
        .single();

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

  async updateQualityTest(
    id: string,
    input: Partial<CreateQualityTestInput> & { status: "draft" | "pending" | "passed" | "failed" },
  ): Promise<DbResult<QualityTest>> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("quality_tests")
        .update({ ...input, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("is_deleted", false)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return { data, error: null };
    } catch (error: unknown) {
      return { data: null, error: (error as Error).message };
    }
  }

  async deleteQualityTest(id: string): Promise<DbResult<null>> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.rpc("delete_quality_test", {
        p_id: id,
      });

      if (error) throw new Error(error.message);

      if (data.error) return { data: null, error: data.error };
      return { data: null, error: null };
    } catch (error: unknown) {
      return { data: null, error: (error as Error).message };
    }
  }
}

export const qualityCheckController = new QualityCheckController();
