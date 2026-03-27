// @ts-nocheck
// src/app/(protected)/(main-pages)/[feature]/utils/query-functions/index.ts
//
// PURPOSE: Client-side API callers.
// USED IN: hooks/use-[feature].tsx (as queryFn and mutationFn)
// DO NOT use in server components or page.tsx — use server-functions instead.
// Naming convention: api* prefix — these call /api/* routes, client-side only
//
// UNWRAP RULE: Always extract `data` from the HTTP response body before returning.
// queryFn must return T so React Query stores T, not { data: T }.
// If you return the full response object, the component will read data.data.

export const apiGetFeatureList = async (): Promise<IFeatureItem[]> => {
  const response = await fetch("/api/feature");
  if (!response.ok) throw new Error("Failed to fetch feature");
  const { data } = await response.json(); // UNWRAP: { data: T } → T
  return data;                             // T — never: return { data }
};

export const apiGetFeatureById = async (id: string): Promise<IFeatureItem> => {
  const response = await fetch(`/api/feature/${id}`);
  if (!response.ok) throw new Error("Failed to fetch feature item");
  const { data } = await response.json();
  return data;
};

export const apiSearchFeature = async (filters: FeatureFilters): Promise<FeatureSearchResult> => {
  const params = new URLSearchParams();
  if (filters.q)          params.set("q", filters.q);
  if (filters.status)     params.set("status", filters.status);
  if (filters.sort_by)    params.set("sort_by", filters.sort_by);
  if (filters.sort_order) params.set("sort_order", filters.sort_order);
  params.set("page",      String(filters.page ?? 1));
  params.set("page_size", String(filters.page_size ?? 20));

  const response = await fetch(`/api/feature/search?${params}`);
  if (!response.ok) throw new Error("Failed to search feature");
  const { data, page, page_size } = await response.json();
  return { items: data, page, page_size };
};

// ─── Mutation functions (used in useMutation.mutationFn) ──────────────────────

export const apiCreateFeature = async (payload: FeatureInsert): Promise<IFeatureItem> => {
  const response = await fetch("/api/feature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to create feature item");
  const { data } = await response.json();
  return data;
};

export const apiUpdateFeature = async ({ id, data }: { id: string; data: FeatureUpdate }): Promise<IFeatureItem> => {
  const response = await fetch(`/api/feature?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update feature item");
  const { data: result } = await response.json();
  return result;
};

export const apiDeleteFeature = async (id: string): Promise<void> => {
  const response = await fetch(`/api/feature?id=${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete feature item");
};
