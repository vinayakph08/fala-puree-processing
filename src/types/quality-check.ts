export type QualityTestStatus = "draft" | "pending" | "passed" | "failed";

export interface QualityTestListItem {
  id: string;
  batch_id: string;
  production_line: string | null;
  status: QualityTestStatus;
  test_date: string;
  created_at: string;
}

export interface Pagination {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
  has_previous_page: boolean;
  has_next_page: boolean;
}

export interface PaginatedQualityTests {
  tests: QualityTestListItem[];
  pagination: Pagination;
}

export interface QualityTest {
  id: string;
  user_id: string;
  batch_id: string;
  production_line: string | null;
  status: QualityTestStatus;

  // Standard quality check
  color_l: number | null;
  color_a: number | null;
  color_b: number | null;
  color_image_url: string | null;
  texture_brix: number | null;
  viscosity_cp: number | null;
  taste_flavour_score: number | null;

  // Cooking stress test
  cooking_color_score: number | null;
  cooking_color_image_url: string | null;
  cooking_taste_score: number | null;

  // Cooking performance
  cooking_notes: string | null;

  // Audit
  test_date: string;
  submitted_at: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}


