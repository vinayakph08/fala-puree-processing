-- ============================================================================
-- Layer 2: {CURSOR_FUNCTION_NAME} — RPC endpoint (cursor-based pagination)
-- Returns a stable, cursor-paginated list of {entities}.
-- FARMER: always scoped to auth.uid() — p_{entity}_id parameter is ignored.
-- ADMIN:  p_{entity}_id scopes to one farmer; NULL = all active farmers.
--
-- Cursor:  Composite (created_at DESC, id DESC) — never timestamp-only.
--          NULL cursor = first page. Pass next_cursor from previous response
--          to advance forward.
-- Limit:   clamped to 1–100 server-side via LEAST/GREATEST.
-- Count:   No total_count — fetches safe_limit + 1 rows to compute has_next_page
--          in a single DB pass without a separate COUNT query.
--
-- Use this template instead of fn-rpc-search-paginated when:
--   - Infinite scroll / "load more" UX (no page-jump needed)
--   - Dataset is large or grows rapidly with frequent inserts
--   - Stable results — new inserts between pages must not cause duplicates/skips
-- ============================================================================

-- Drop old signature before recreating if parameters changed from a previous version.
-- Adjust the old param type list to match what was deployed previously.
-- DROP FUNCTION IF EXISTS public.{cursor_function_name}({old_param_type_list});

CREATE OR REPLACE FUNCTION public.{cursor_function_name}(
    p_cursor_ts     TIMESTAMPTZ DEFAULT NULL,  -- created_at of the last item seen; NULL = first page
    p_cursor_id     UUID        DEFAULT NULL,  -- id of the last item seen; NULL = first page
    p_limit         INT         DEFAULT 50,    -- clamped server-side to 1–100
    p_search_term   TEXT        DEFAULT NULL,  -- searches {searchable_col_1} and farmer name; NULL = no filter
    p_{filter_col}  TEXT        DEFAULT NULL,  -- e.g. p_order_status, p_crop_type; NULL = no filter
    p_{entity}_id   UUID        DEFAULT NULL   -- ADMIN scope filter; FARMER always uses auth.uid()
) RETURNS JSON AS $$
DECLARE
    user_role       TEXT;
    current_user_id UUID;
    safe_limit      INT;
    fetch_limit     INT;   -- safe_limit + 1: extra row detects has_next_page
    search_pattern  TEXT;
    has_next        BOOLEAN;
    result_rows     JSON;
    last_row        RECORD;
BEGIN
    user_role       := public.get_user_role();
    current_user_id := auth.uid();

    IF user_role NOT IN ('FARMER', 'ADMIN') OR current_user_id IS NULL THEN
        RETURN json_build_object('data', NULL, 'error', 'Insufficient permissions');
    END IF;

    -- Clamp limit to safe bounds — prevents unbounded result sets
    safe_limit  := LEAST(GREATEST(p_limit, 1), 100);
    fetch_limit := safe_limit + 1;  -- fetch one extra to detect if a next page exists

    -- Normalise search term: NULL or blank → NULL (predicate short-circuits safely)
    search_pattern := CASE
        WHEN p_search_term IS NOT NULL AND TRIM(p_search_term) != ''
        THEN '%' || LOWER(TRIM(p_search_term)) || '%'
        ELSE NULL
    END;

    WITH fetched AS (
        SELECT
            t.id,
            t.{col_1},               -- add all columns needed in the response
            t.{col_2},
            t.created_at,
            t.{entity_id_column},
            up.first_name,
            up.last_name,
            -- Row number allows slicing after counting to safe_limit
            ROW_NUMBER() OVER (ORDER BY t.created_at DESC, t.id DESC) AS rn
        FROM public.{table} t
        INNER JOIN public.user_profile up ON t.{entity_id_column} = up.id
        WHERE t.is_deleted = FALSE
          AND up.is_active  = TRUE
          -- Role gate: FARMER locked to self; ADMIN sees all or scoped by p_{entity}_id
          AND (
              (user_role = 'FARMER' AND t.{entity_id_column} = current_user_id) OR
              (user_role = 'ADMIN'  AND (p_{entity}_id IS NULL OR t.{entity_id_column} = p_{entity}_id))
          )
          -- Optional enum / status filter (NULL disables filter)
          AND (p_{filter_col} IS NULL OR t.{filter_col_column} = p_{filter_col})
          -- Full-text search: extend OR clauses as needed for additional searchable columns
          AND (search_pattern IS NULL
               OR LOWER(t.{searchable_col_1}) LIKE search_pattern
               OR LOWER(CONCAT(up.first_name, ' ', up.last_name)) LIKE search_pattern)
          -- Cursor predicate: skip everything the caller already saw.
          -- Composite (created_at, id) avoids tie-breaker duplicates.
          -- NULL cursors = first page (no predicate applied).
          AND (
              p_cursor_ts IS NULL OR p_cursor_id IS NULL
              OR (t.created_at, t.id) < (p_cursor_ts, p_cursor_id)
          )
        ORDER BY t.created_at DESC, t.id DESC
        LIMIT fetch_limit   -- one extra row to detect has_next_page
    )
    SELECT
        -- Build JSON array of the actual page (rows 1..safe_limit only)
        COALESCE(json_agg(json_build_object(
            'id',              f.id,
            '{col_1}',         f.{col_1},
            '{col_2}',         f.{col_2},
            'created_at',      f.created_at,
            '{entity}_name',   CONCAT(f.first_name, ' ', f.last_name)
            -- add more fields as needed
        ) ORDER BY f.created_at DESC, f.id DESC)
        FILTER (WHERE f.rn <= safe_limit),   -- exclude the extra detection row
        '[]'::json),
        -- Detect next page from the extra row count
        COUNT(*) > safe_limit
    INTO result_rows, has_next
    FROM fetched f;

    -- Determine the next cursor from the last real row returned
    IF has_next THEN
        SELECT f.created_at, f.id
        INTO last_row
        FROM (
            SELECT t.id, t.created_at,
                   ROW_NUMBER() OVER (ORDER BY t.created_at DESC, t.id DESC) AS rn
            FROM public.{table} t
            INNER JOIN public.user_profile up ON t.{entity_id_column} = up.id
            WHERE t.is_deleted = FALSE
              AND up.is_active  = TRUE
              AND (
                  (user_role = 'FARMER' AND t.{entity_id_column} = current_user_id) OR
                  (user_role = 'ADMIN'  AND (p_{entity}_id IS NULL OR t.{entity_id_column} = p_{entity}_id))
              )
              AND (p_{filter_col} IS NULL OR t.{filter_col_column} = p_{filter_col})
              AND (search_pattern IS NULL
                   OR LOWER(t.{searchable_col_1}) LIKE search_pattern
                   OR LOWER(CONCAT(up.first_name, ' ', up.last_name)) LIKE search_pattern)
              AND (
                  p_cursor_ts IS NULL OR p_cursor_id IS NULL
                  OR (t.created_at, t.id) < (p_cursor_ts, p_cursor_id)
              )
            ORDER BY t.created_at DESC, t.id DESC
            LIMIT safe_limit   -- last item of the real page (not the extra row)
        ) f
        WHERE f.rn = safe_limit;
    END IF;

    RETURN json_build_object(
        'data', json_build_object(
            '{entities}',  result_rows,
            'next_cursor', CASE WHEN has_next
                THEN json_build_object('ts', last_row.created_at, 'id', last_row.id)
                ELSE NULL
            END,
            'has_next_page', has_next
        ),
        'error', NULL
    );

EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('data', NULL, 'error', 'An unexpected error occurred');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANTS AND PERMISSIONS
-- ============================================================================
GRANT EXECUTE ON FUNCTION public.{cursor_function_name}(TIMESTAMPTZ, UUID, INT, TEXT, TEXT, UUID) TO authenticated;
