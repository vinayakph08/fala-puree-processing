-- Migration: quality_test_images
-- Created: 2026-04-04
-- Purpose:
--   Create the quality_test_images table to store image URLs captured
--   during spinach puree quality tests (both standard and cooking stress tests).
--   Each row links an image to a specific quality_test record.
--   Supports soft-delete with deleted_by audit trail.

-- ============================================================================
-- TABLE CREATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.quality_test_images (
  id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id     UUID        NOT NULL REFERENCES public.quality_tests(id) ON DELETE CASCADE,
  image_url   TEXT        NOT NULL,

  -- Soft delete
  is_deleted  BOOLEAN     NOT NULL DEFAULT false,
  deleted_by  UUID        REFERENCES auth.users(id),
  deleted_at  TIMESTAMPTZ,

  -- Audit
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_quality_test_images_test_id
  ON public.quality_test_images (test_id);

CREATE INDEX IF NOT EXISTS idx_quality_test_images_is_deleted
  ON public.quality_test_images (is_deleted);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.quality_test_images ENABLE ROW LEVEL SECURITY;

-- Authenticated users (USER and ADMIN) can view non-deleted images
CREATE POLICY "Authenticated users can view non-deleted test images"
  ON public.quality_test_images
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND is_deleted = FALSE);

-- Authenticated users can insert images
CREATE POLICY "Authenticated users can insert test images"
  ON public.quality_test_images
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Authenticated users can update (used for soft-delete)
CREATE POLICY "Authenticated users can update test images"
  ON public.quality_test_images
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- ============================================================================
-- UPDATED_AT TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_quality_test_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER quality_test_images_updated_at
  BEFORE UPDATE ON public.quality_test_images
  FOR EACH ROW EXECUTE FUNCTION public.update_quality_test_images_updated_at();

-- ============================================================================
-- STORAGE BUCKET
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('quality-test-images', 'quality-test-images', false)
ON CONFLICT DO NOTHING;

-- All authenticated users (USER + ADMIN) can view images
CREATE POLICY "Authenticated users can read quality test images"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'quality-test-images');

-- All authenticated users (USER + ADMIN) can upload images
CREATE POLICY "Authenticated users can upload quality test images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'quality-test-images');

-- Only admins (Supervisors) can delete images
CREATE POLICY "Admins can delete quality test images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'quality-test-images' AND public.is_admin());
