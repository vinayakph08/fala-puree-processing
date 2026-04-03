-- Migration: quality_tests table for Puree QC feature
-- Created: 2026-03-28

CREATE TABLE IF NOT EXISTS public.quality_tests (
  id                      UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                 UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  batch_id                TEXT          NOT NULL,
  production_line         TEXT,
  status                  TEXT          NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('draft', 'pending', 'passed', 'failed')),

  -- Standard quality check — Color Analysis (L*a*b* colorspace)
  color_l                 NUMERIC(10, 4),
  color_a                 NUMERIC(10, 4),
  color_b                 NUMERIC(10, 4),
  color_image_url         TEXT,

  -- Standard quality check — Texture (Brix refractometer)
  texture_brix            NUMERIC(10, 4),

  -- Standard quality check — Viscosity (Bostwick consistometer)
  viscosity_cp            NUMERIC(10, 4),

  -- Standard quality check — Taste & Flavour
  taste_flavour_score     NUMERIC(10, 4),

  -- Cooking stress test
  cooking_color_score     NUMERIC(10, 4),
  cooking_color_image_url TEXT,
  cooking_taste_score     NUMERIC(10, 4),
  cooking_taste_image_url TEXT,

  -- Cooking performance notes
  cooking_notes           TEXT,

  -- Audit
  test_date               TIMESTAMPTZ   NOT NULL DEFAULT now(),
  submitted_at            TIMESTAMPTZ,
  is_deleted              BOOLEAN       NOT NULL DEFAULT false,
  deleted_at              TIMESTAMPTZ,
  created_at              TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_quality_tests_user_id  ON public.quality_tests (user_id);
CREATE INDEX IF NOT EXISTS idx_quality_tests_batch_id ON public.quality_tests (batch_id);
CREATE INDEX IF NOT EXISTS idx_quality_tests_status   ON public.quality_tests (status);

-- Row Level Security
ALTER TABLE public.quality_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all tests"
  ON public.quality_tests FOR SELECT
  USING (auth.uid() IS NOT NULL AND is_deleted = FALSE);

CREATE POLICY "Users can create own tests"
  ON public.quality_tests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tests"
  ON public.quality_tests FOR UPDATE
  USING (auth.uid() = user_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_quality_tests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quality_tests_updated_at
  BEFORE UPDATE ON public.quality_tests
  FOR EACH ROW EXECUTE FUNCTION public.update_quality_tests_updated_at();
