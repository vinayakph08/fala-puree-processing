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

-- Users see only their own non-deleted tests; admins see all
CREATE POLICY "Users can view own tests, admins can view all"
  ON public.quality_tests FOR SELECT
  USING (is_deleted = FALSE AND (auth.uid() = user_id OR public.is_admin()));

CREATE POLICY "Users can create own tests"
  ON public.quality_tests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can update any test (required for soft-delete); users update their own
CREATE POLICY "Users can update own tests, admins can update any"
  ON public.quality_tests FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());



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

-- ============================================================================
-- RPC: delete_quality_test — soft-delete with server-side admin/owner check
-- Returns: { data: null, error: string | null }
-- ============================================================================

CREATE OR REPLACE FUNCTION public.delete_quality_test(p_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_test public.quality_tests%ROWTYPE;
BEGIN
  -- Fetch the test (ignore is_deleted so we can give a clear error)
  SELECT * INTO v_test
  FROM public.quality_tests
  WHERE id = p_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('data', NULL, 'error', 'Test not found');
  END IF;

  IF v_test.is_deleted THEN
    RETURN jsonb_build_object('data', NULL, 'error', 'Test already deleted');
  END IF;

  -- Server-side authorization check
  IF v_test.user_id <> auth.uid() AND NOT public.is_admin() THEN
    RETURN jsonb_build_object('data', NULL, 'error', 'Not authorized to delete this test');
  END IF;

  UPDATE public.quality_tests
  SET
    is_deleted = TRUE,
    deleted_at = now(),
    updated_at = now()
  WHERE id = p_id;

  RETURN jsonb_build_object('data', NULL, 'error', NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.delete_quality_test(UUID) TO authenticated;
