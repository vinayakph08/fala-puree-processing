-- Migration: quality_test_images storage bucket
-- Created: 2026-04-04
-- Purpose:
--   Create the quality-test-images Supabase Storage bucket.
--   Images are stored directly as URL columns on quality_tests
--   (color_image_url, cooking_color_image_url) — no separate images table.

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
