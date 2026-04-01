-- ============================================================================
-- Layer 1: {HELPER_FUNCTION_NAME} — INTERNAL: not an RPC endpoint
-- {DESCRIPTION}: returns {what_it_aggregates} from public.{table}.
-- p_{entity}_id = NULL → aggregate across all {entities} (admin use case).
-- NOTE: Must be plpgsql (not sql) to prevent query inlining which would discard
--       SECURITY DEFINER and expose the function to the caller's RLS.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.{helper_function_name}(
    p_{entity}_id UUID DEFAULT NULL
) RETURNS {RETURN_TYPE} AS $$        -- e.g. NUMERIC, BIGINT, TEXT
DECLARE
    result {RETURN_TYPE};
BEGIN
    SELECT COALESCE(SUM(t.{metric_column}), 0)   -- adjust: SUM / COUNT(*) / MAX
    INTO result
    FROM public.{table} t
    WHERE (p_{entity}_id IS NULL OR t.{entity_id_column} = p_{entity}_id)
      AND t.is_deleted = FALSE;
      -- AND t.{status_column} = '{required_status}'  -- uncomment if a status filter is needed
      --                                               -- e.g. order_status = 'DELIVERED'
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Additional scalar helper — add more as needed following the same pattern
-- ============================================================================
CREATE OR REPLACE FUNCTION public.{helper_function_name_2}(
    p_{entity}_id UUID DEFAULT NULL
) RETURNS {RETURN_TYPE_2} AS $$
DECLARE
    result {RETURN_TYPE_2};
BEGIN
    SELECT COUNT(*)
    INTO result
    FROM public.{table} t
    WHERE (p_{entity}_id IS NULL OR t.{entity_id_column} = p_{entity}_id)
      AND t.is_deleted = FALSE;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANTS AND PERMISSIONS
-- ============================================================================
GRANT EXECUTE ON FUNCTION public.{helper_function_name}(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.{helper_function_name_2}(UUID) TO authenticated;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================
COMMENT ON FUNCTION public.{helper_function_name}(UUID) IS
'INTERNAL scalar helper. Returns {what_it_aggregates} from public.{table}.
 p_{entity}_id = NULL aggregates across all {entities} (admin path).
 Must be plpgsql to prevent inlining that would discard SECURITY DEFINER.';
