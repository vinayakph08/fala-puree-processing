import type { QualityTest } from "@/types";

export const apiGetQualityTests = async (): Promise<QualityTest[]> => {
  const response = await fetch("/api/quality-check");
  if (!response.ok) throw new Error("Failed to fetch quality tests");
  const { data } = await response.json();
  return data;
};
