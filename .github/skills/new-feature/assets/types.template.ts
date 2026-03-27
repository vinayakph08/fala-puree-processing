// @ts-nocheck
// src/types/[feature].ts
// Replace [feature] and [Feature] with your feature name
//
// NOTE: DbResult<T> is a shared utility type — it lives in src/types/index.ts, NOT here.
// Import it in db-controller: import type { DbResult } from "@/types"

export interface IFeatureItem {
  id: string;
  farmer_id: string;
  // --- domain fields (add yours here) ---
  name: string;
  status: FeatureStatus;
  notes?: string | null;
  // --- audit fields ---
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export type FeatureStatus = "active" | "completed" | "cancelled";

export type FeatureInsert = Omit<
  IFeatureItem,
  "id" | "created_at" | "updated_at" | "is_deleted" | "deleted_at"
>;

export type FeatureUpdate = Partial<FeatureInsert>;

// ─── Filter / Search Types ────────────────────────────────────────────────────

export type FeatureFilters = {
  q?: string;
  status?: FeatureStatus;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  page_size?: number;
};

export type FeatureSearchResult = {
  items: IFeatureItem[];
  total: number;
  page: number;
  page_size: number;
};
