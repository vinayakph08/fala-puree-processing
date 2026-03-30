-- Migration: quality_tests table for Puree QC feature
-- Created: 2026-03-28

CREATE TABLE IF NOT EXISTS quality_tests (
  id                    UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  batch_id              TEXT          NOT NULL,
  production_line       TEXT,
  status                TEXT          NOT NULL DEFAULT 'draft'
                          CHECK (status IN ('draft', 'pending', 'passed', 'failed')),

  -- Color Analysis (L*a*b* colorspace)
  color_l               NUMERIC(10, 4),
  color_a               NUMERIC(10, 4),
  color_b               NUMERIC(10, 4),
  color_image_url       TEXT,

  -- Texture (Brix refractometer)
  texture_brix          NUMERIC(10, 4),

  -- Viscosity (Bostwick consistometer)
  viscosity_cp          NUMERIC(10, 4),

  -- Cooking Performance
  boil_time_s           INTEGER,
  maillard_index        NUMERIC(10, 4),
  cooking_notes         TEXT,

  -- System Performance (Color Profile delta E, texture probe peaks)
  pre_cooking_delta_e   NUMERIC(10, 4),
  post_cooking_delta_e  NUMERIC(10, 4),
  texture_initial_peak_n NUMERIC(10, 4),
  texture_final_peak_n  NUMERIC(10, 4),

  -- Audit
  test_date             TIMESTAMPTZ   NOT NULL DEFAULT now(),
  submitted_at          TIMESTAMPTZ,
  is_deleted            BOOLEAN       NOT NULL DEFAULT false,
  deleted_at            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_quality_tests_user_id ON quality_tests (user_id);
CREATE INDEX IF NOT EXISTS idx_quality_tests_status  ON quality_tests (status);

-- Row Level Security
ALTER TABLE quality_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tests"
  ON quality_tests FOR SELECT
  USING (auth.uid() = user_id AND is_deleted = false);

CREATE POLICY "Users can create own tests"
  ON quality_tests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tests"
  ON quality_tests FOR UPDATE
  USING (auth.uid() = user_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_quality_tests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quality_tests_updated_at
  BEFORE UPDATE ON quality_tests
  FOR EACH ROW EXECUTE FUNCTION update_quality_tests_updated_at();
