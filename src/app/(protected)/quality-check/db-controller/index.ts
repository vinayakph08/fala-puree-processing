import { createClient } from "@/utils/supabase/server";
import type { DbResult, QualityTest } from "@/types";

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
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }
}

export const qualityCheckController = new QualityCheckController();
