export type QualityTestStatus = "draft" | "pending" | "passed" | "failed";

export interface QualityTest {
  id: string;
  user_id: string;
  batch_id: string;
  production_line: string | null;
  status: QualityTestStatus;
  color_l: number | null;
  color_a: number | null;
  color_b: number | null;
  color_image_url: string | null;
  texture_brix: number | null;
  viscosity_cp: number | null;
  boil_time_s: number | null;
  maillard_index: number | null;
  cooking_notes: string | null;
  pre_cooking_delta_e: number | null;
  post_cooking_delta_e: number | null;
  texture_initial_peak_n: number | null;
  texture_final_peak_n: number | null;
  test_date: string;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}


