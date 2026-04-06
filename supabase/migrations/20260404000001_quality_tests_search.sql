-- Migration: quality_tests search RPC + get_user_role helper
-- Created: 2026-04-04
-- Purpose:
--   1. get_user_role() — INTERNAL scalar helper, reads role from user_profile.
--   2. search_quality_tests() — paginated, searchable, filterable list RPC
--      for the quality check dashboard. Both USER and ADMIN see all tests
--      (facility-wide scope — no per-user filtering on this table).

-- ============================================================================
-- LAYER 1: get_user_role — INTERNAL scalar helper
-- INTERNAL: not an RPC endpoint. Returns 'USER' | 'ADMIN' for auth.uid().
-- Used by Layer 2 RPCs to enforce role-based access without duplicate profile queries.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
DECLARE
    result TEXT;
BEGIN
    SELECT role
    INTO result
    FROM public.user_profile
    WHERE id = auth.uid();

    RETURN COALESCE(result, 'USER');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- LAYER 2: search_quality_tests — RPC endpoint (search + filter + pagination)
-- Returns a paginated, searchable, filterable list of quality_tests.
-- Both USER and ADMIN roles see ALL tests (facility-wide scope).
-- Unauthenticated callers are rejected.
--
-- Search:   p_search_term — matches batch_id (case-insensitive LIKE)
-- Filter:   p_status — matches status column exactly; NULL = no filter
-- Sort:     p_sort_by — 'test_date' | 'created_at'; default 'test_date'
--           p_sort_dir — 'ASC' | 'DESC'; default 'DESC'
-- Pagination: offset-based via p_page (0-based) + p_limit (clamped 1–100)
-- Returns: { data: { tests: [...], pagination: {...} }, error }
-- ============================================================================

CREATE OR REPLACE FUNCTION public.search_quality_tests(
    p_search_term   TEXT    DEFAULT NULL,
    p_status        TEXT    DEFAULT NULL,
    p_sort_by       TEXT    DEFAULT 'test_date',
    p_sort_dir      TEXT    DEFAULT 'DESC',
    p_page          INT     DEFAULT 0,
    p_limit         INT     DEFAULT 20
) RETURNS JSON AS $$
DECLARE
    user_role       TEXT;
    current_user_id UUID;
    safe_limit      INT;
    search_pattern  TEXT;
    safe_sort_col   TEXT;
    safe_sort_dir   TEXT;
BEGIN
    user_role       := public.get_user_role();
    current_user_id := auth.uid();

    IF current_user_id IS NULL THEN
        RETURN json_build_object('data', NULL, 'error', 'Insufficient permissions');
    END IF;

    -- Clamp limit to safe bounds
    safe_limit := LEAST(GREATEST(p_limit, 1), 100);

    -- Normalise search term
    search_pattern := CASE
        WHEN p_search_term IS NOT NULL AND TRIM(p_search_term) != ''
        THEN '%' || LOWER(TRIM(p_search_term)) || '%'
        ELSE NULL
    END;

    -- Allowlist sort column
    safe_sort_col := CASE p_sort_by
        WHEN 'test_date'   THEN 'test_date'
        WHEN 'created_at'  THEN 'created_at'
        ELSE 'test_date'
    END;

    -- Allowlist sort direction
    safe_sort_dir := CASE UPPER(TRIM(p_sort_dir)) WHEN 'ASC' THEN 'ASC' ELSE 'DESC' END;

    RETURN (
        WITH filtered AS (
            SELECT
                t.id,
                t.batch_id,
                t.production_line,
                t.status,
                t.test_date,
                t.created_at
            FROM public.quality_tests t
            WHERE t.is_deleted = FALSE
              AND (user_role = 'ADMIN' OR t.user_id = current_user_id)
              AND (p_status IS NULL OR t.status = p_status)
              AND (search_pattern IS NULL OR LOWER(t.batch_id) LIKE search_pattern)
        ),
        paginated AS (
            SELECT *, COUNT(*) OVER() AS total_count
            FROM filtered
            ORDER BY
                CASE WHEN safe_sort_col = 'test_date'  AND safe_sort_dir = 'DESC' THEN test_date  END DESC NULLS LAST,
                CASE WHEN safe_sort_col = 'test_date'  AND safe_sort_dir = 'ASC'  THEN test_date  END ASC  NULLS LAST,
                CASE WHEN safe_sort_col = 'created_at' AND safe_sort_dir = 'DESC' THEN created_at END DESC NULLS LAST,
                CASE WHEN safe_sort_col = 'created_at' AND safe_sort_dir = 'ASC'  THEN created_at END ASC  NULLS LAST
            LIMIT safe_limit OFFSET p_page * safe_limit
        )
        SELECT json_build_object(
            'data', json_build_object(
                'tests', COALESCE(
                    json_agg(
                        json_build_object(
                            'id',              id,
                            'batch_id',        batch_id,
                            'production_line', production_line,
                            'status',          status,
                            'test_date',       test_date,
                            'created_at',      created_at
                        ) ORDER BY
                            CASE WHEN safe_sort_col = 'test_date'  AND safe_sort_dir = 'DESC' THEN test_date  END DESC NULLS LAST,
                            CASE WHEN safe_sort_col = 'test_date'  AND safe_sort_dir = 'ASC'  THEN test_date  END ASC  NULLS LAST,
                            CASE WHEN safe_sort_col = 'created_at' AND safe_sort_dir = 'DESC' THEN created_at END DESC NULLS LAST,
                            CASE WHEN safe_sort_col = 'created_at' AND safe_sort_dir = 'ASC'  THEN created_at END ASC  NULLS LAST
                    ),
                    '[]'::json
                ),
                'pagination', json_build_object(
                    'page',              p_page,
                    'per_page',          safe_limit,
                    'total_count',       COALESCE(MAX(total_count), 0),
                    'total_pages',       COALESCE(CEIL(MAX(total_count)::DECIMAL / NULLIF(safe_limit, 0)), 0),
                    'has_previous_page', p_page > 0,
                    'has_next_page',     (p_page + 1) * safe_limit < COALESCE(MAX(total_count), 0)
                )
            ),
            'error', NULL
        )
        FROM paginated
    );

EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('data', NULL, 'error', 'An unexpected error occurred');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANTS AND PERMISSIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION public.get_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_quality_tests(TEXT, TEXT, TEXT, TEXT, INT, INT) TO authenticated;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION public.get_user_role() IS
'INTERNAL scalar helper. Returns role (USER | ADMIN) for auth.uid() from user_profile.
 Not a direct RPC endpoint — called by other Layer 2 functions. SECURITY DEFINER.';

COMMENT ON FUNCTION public.search_quality_tests(TEXT, TEXT, TEXT, TEXT, INT, INT) IS
'Paginated, searchable, filterable list of quality_tests.
 Both USER and ADMIN see all tests (facility-wide scope).
 p_search_term: matched against batch_id (case-insensitive LIKE).
 p_status: exact match filter; NULL disables filter.
 p_sort_by: "test_date" (default) | "created_at". p_sort_dir: DESC (default) | ASC.
 p_page: 0-based. p_limit: clamped 1–100 (default 20).
 Returns {data: {tests, pagination}, error}.';
