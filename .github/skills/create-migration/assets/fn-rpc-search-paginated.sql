-- ============================================================================
-- Layer 2: {SEARCH_FUNCTION_NAME} — RPC endpoint (search + filter + pagination + sort)
-- Returns a paginated, searchable, filterable, sortable list of {entities}.
-- FARMER: always scoped to auth.uid() — p_{entity}_id parameter is ignored.
-- ADMIN:  p_{entity}_id scopes to one farmer; NULL = all active farmers.
--
-- Pagination: COUNT(*) OVER() window function — single DB pass, no second query.
-- Sort:       CASE-based allowlist — no dynamic SQL, injection-safe.
-- Limit:      clamped to 1–100 server-side via LEAST/GREATEST.
-- ============================================================================

-- Drop old signature before recreating if parameters changed from a previous version.
-- Adjust the old param type list to match what was deployed previously.
-- DROP FUNCTION IF EXISTS public.{search_function_name}({old_param_type_list});

CREATE OR REPLACE FUNCTION public.{search_function_name}(
    p_search_term   TEXT    DEFAULT NULL,         -- searches {searchable_col_1} and farmer name
    p_{filter_col}  TEXT    DEFAULT NULL,         -- e.g. p_order_status, p_crop_type; NULL = no filter
    p_sort_by       TEXT    DEFAULT 'created_at', -- allowlisted: 'created_at' | '{alt_sort_col}'
    p_sort_dir      TEXT    DEFAULT 'DESC',       -- 'ASC' or 'DESC'
    p_page          INT     DEFAULT 0,            -- 0-based page index
    p_limit         INT     DEFAULT 50,           -- clamped server-side to 1–100
    p_{entity}_id   UUID    DEFAULT NULL          -- ADMIN scope filter; FARMER always uses auth.uid()
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

    IF user_role NOT IN ('FARMER', 'ADMIN') OR current_user_id IS NULL THEN
        RETURN json_build_object('data', NULL, 'error', 'Insufficient permissions');
    END IF;

    -- Clamp limit to safe bounds — prevents unbounded result sets
    safe_limit := LEAST(GREATEST(p_limit, 1), 100);

    -- Normalise search term: NULL or blank → NULL (predicate short-circuits safely)
    search_pattern := CASE
        WHEN p_search_term IS NOT NULL AND TRIM(p_search_term) != ''
        THEN '%' || LOWER(TRIM(p_search_term)) || '%'
        ELSE NULL
    END;

    -- Allowlist sort column to prevent injection via dynamic ORDER BY
    safe_sort_col := CASE p_sort_by
        WHEN 'created_at'      THEN 'created_at'
        WHEN '{alt_sort_col}'  THEN '{alt_sort_col}'   -- e.g. 'order_date', 'total_price'
        ELSE 'created_at'                              -- default fallback
    END;

    -- Allowlist sort direction
    safe_sort_dir := CASE UPPER(TRIM(p_sort_dir)) WHEN 'ASC' THEN 'ASC' ELSE 'DESC' END;

    RETURN (
        WITH filtered AS (
            SELECT
                t.id,
                t.{col_1},               -- add all columns needed in the response
                t.{col_2},
                t.created_at,
                t.{alt_sort_col},        -- include any column used in ORDER BY
                t.{entity_id_column},
                up.first_name,
                up.last_name
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
        ),
        paginated AS (
            SELECT *, COUNT(*) OVER() AS total_count
            FROM filtered
            ORDER BY
                -- One CASE pair per allowed sort column and direction.
                -- Add more pairs when extending the safe_sort_col allowlist above.
                CASE WHEN safe_sort_col = 'created_at'     AND safe_sort_dir = 'DESC' THEN created_at     END DESC NULLS LAST,
                CASE WHEN safe_sort_col = 'created_at'     AND safe_sort_dir = 'ASC'  THEN created_at     END ASC  NULLS LAST,
                CASE WHEN safe_sort_col = '{alt_sort_col}' AND safe_sort_dir = 'DESC' THEN {alt_sort_col} END DESC NULLS LAST,
                CASE WHEN safe_sort_col = '{alt_sort_col}' AND safe_sort_dir = 'ASC'  THEN {alt_sort_col} END ASC  NULLS LAST
            LIMIT safe_limit OFFSET p_page * safe_limit
        )
        SELECT json_build_object(
            'data', json_build_object(
                '{entities}', COALESCE(json_agg(json_build_object(
                    'id',              id,
                    '{col_1}',         {col_1},
                    '{col_2}',         {col_2},
                    '{entity}_name',   CONCAT(first_name, ' ', last_name)
                    -- add more fields as needed
                ) ORDER BY
                    -- Mirror the ORDER BY from paginated CTE to preserve sort in json_agg
                    CASE WHEN safe_sort_col = 'created_at'     AND safe_sort_dir = 'DESC' THEN created_at     END DESC,
                    CASE WHEN safe_sort_col = '{alt_sort_col}' AND safe_sort_dir = 'DESC' THEN {alt_sort_col} END DESC
                ), '[]'::json),
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
GRANT EXECUTE ON FUNCTION public.{search_function_name}(TEXT, TEXT, TEXT, TEXT, INT, INT, UUID) TO authenticated;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================
COMMENT ON FUNCTION public.{search_function_name}(TEXT, TEXT, TEXT, TEXT, INT, INT, UUID) IS
'Returns paginated, searchable, filterable list of {entities} with {data, error} envelope.
 FARMER scoped to auth.uid(). ADMIN can scope by p_{entity}_id or pass NULL for all.
 p_limit clamped to 1–100. Sort column allowlisted to prevent injection.';
