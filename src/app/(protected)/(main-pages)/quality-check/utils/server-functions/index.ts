import { qualityCheckController } from "../../db-controller";
import type { QualityTest } from "@/types";

export const dbGetQualityTests = async ({
  user_id,
}: {
  user_id: string;
}): Promise<QualityTest[]> => {
  const { data, error } = await qualityCheckController.getQualityTests({
    user_id,
  });
  if (error || !data) return [];
  return data;
};
