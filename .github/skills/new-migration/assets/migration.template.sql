-- Migration: [describe what this migration does]
-- Created: Run `npm run new-migration` to scaffold this file
--
-- Replace [feature] with your table/feature name throughout.

-- ─── Table ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.[feature] (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Domain columns (add yours here)
  name          TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'active',
  notes         TEXT,

  -- Soft delete
  is_deleted    BOOLEAN NOT NULL DEFAULT false,
  deleted_at    TIMESTAMPTZ,

  -- Audit
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_[feature]_farmer_id
  ON public.[feature](farmer_id);

CREATE INDEX IF NOT EXISTS idx_[feature]_created_at
  ON public.[feature](created_at DESC);

-- ─── updated_at Trigger ───────────────────────────────────────────────────────
-- Assumes update_updated_at_column() function already exists.
-- If not, create it in a separate earlier migration.

CREATE OR REPLACE TRIGGER update_[feature]_updated_at
  BEFORE UPDATE ON public.[feature]
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE public.[feature] ENABLE ROW LEVEL SECURITY;

CREATE POLICY "[feature]: user select own"
  ON public.[feature] FOR SELECT
  USING (farmer_id = auth.uid());

CREATE POLICY "[feature]: user insert own"
  ON public.[feature] FOR INSERT
  WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "[feature]: user update own"
  ON public.[feature] FOR UPDATE
  USING (farmer_id = auth.uid())
  WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "[feature]: user delete own"
  ON public.[feature] FOR DELETE
  USING (farmer_id = auth.uid());

-- ─── Soft Delete RPC (optional — add if using soft delete pattern) ────────────

CREATE OR REPLACE FUNCTION soft_delete_[feature](p_[feature]_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.[feature]
  SET is_deleted = true,
      deleted_at = now()
  WHERE id = p_[feature]_id
    AND farmer_id = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION restore_[feature](p_[feature]_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.[feature]
  SET is_deleted = false,
      deleted_at = null
  WHERE id = p_[feature]_id
    AND farmer_id = auth.uid();
END;
$$;
