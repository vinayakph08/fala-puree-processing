import type { QualityTest, PaginatedQualityTests } from "@/types";

export type SearchQualityTestsParams = {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
};

export const apiSearchQualityTests = async (
  params: SearchQualityTestsParams = {},
): Promise<PaginatedQualityTests> => {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));

  const response = await fetch(`/api/quality-check?${query.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch quality tests");
  const { data } = await response.json();
  return data as PaginatedQualityTests;
};

export const apiGetQualityTestById = async (
  id: string,
): Promise<QualityTest> => {
  const response = await fetch(`/api/quality-check/${id}`);
  if (!response.ok) throw new Error("Failed to fetch quality test");
  const { data } = await response.json();
  return data as QualityTest;
};

export const apiUpdateQualityTest = async (
  id: string,
  body: Record<string, unknown>,
): Promise<QualityTest> => {
  const response = await fetch(`/api/quality-check/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("Failed to update quality test");
  const { data } = await response.json();
  return data as QualityTest;
};

export const apiDeleteQualityTest = async (id: string): Promise<void> => {
  const response = await fetch(`/api/quality-check/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete quality test");
};
