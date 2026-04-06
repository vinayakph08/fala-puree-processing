import { qualityCheckController } from "../../db-controller";
import type { QualityTest, PaginatedQualityTests } from "@/types";
import type { SearchQualityTestsInput } from "../../db-controller";

export const dbSearchQualityTests = async (
  params: SearchQualityTestsInput = {},
): Promise<PaginatedQualityTests> => {
  const { data, error } = await qualityCheckController.searchQualityTests(params);
  if (error || !data) return { tests: [], pagination: { page: 0, per_page: 20, total_count: 0, total_pages: 0, has_previous_page: false, has_next_page: false } };
  return data;
};

export const dbGetQualityTestById = async (id: string): Promise<QualityTest | null> => {
  const { data, error } = await qualityCheckController.getQualityTestById(id);
  if (error || !data) return null;
  return data;
};
