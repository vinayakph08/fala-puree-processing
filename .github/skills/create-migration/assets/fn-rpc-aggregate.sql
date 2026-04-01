-- ============================================================================
-- Layer 2: {FUNCTION_NAME} — RPC endpoint
-- {DESCRIPTION}
-- FARMER: always scoped to auth.uid() regardless of p_{entity}_id value.
-- ADMIN:  p_{entity}_id IS NOT NULL → specific {entity} (index-backed path).
--         p_{entity}_id IS NULL     → all active {entities} (full scan, expected).
--
-- Delegates data access to Layer 1 scalar helpers:
--   - public.{helper_1}()   → {what_helper_1_returns}
--   - public.{helper_2}()   → {what_helper_2_returns}
--
-- Separate IF/ELSE branches produce distinct query plans so the planner can
-- use the {entity}_id-leading index on the scoped path and a full scan on
-- the admin-all path. A single "OR NULL" predicate risks the planner ignoring
-- the index entirely.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.{function_name}(
    p_{entity}_id UUID DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    user_role               TEXT;
    effective_{entity}_id   UUID;
    v_{metric_1}            {TYPE_1};   -- e.g. NUMERIC, BIGINT
    v_{metric_2}            {TYPE_2};   -- add/remove variables to match your metrics
BEGIN
    user_role := public.get_user_role();

    -- Role gate: FARMER always locked to self; ADMIN uses passed parameter
    IF user_role = 'FARMER' THEN
        effective_{entity}_id := auth.uid();
    ELSIF user_role = 'ADMIN' THEN
        effective_{entity}_id := p_{entity}_id;
    ELSE
        RETURN json_build_object('data', NULL, 'error', 'Insufficient permissions');
    END IF;

    IF effective_{entity}_id IS NOT NULL THEN
        -- {entity}-scoped path: index-backed via {entity}_id-leading composite index
        v_{metric_1} := public.{helper_1}(effective_{entity}_id);
        v_{metric_2} := public.{helper_2}(effective_{entity}_id);
    ELSE
        -- Admin all-{entities} path: aggregates across all active farmers (full scan)
        v_{metric_1} := public.{helper_1}(NULL);
        v_{metric_2} := public.{helper_2}(NULL);
    END IF;

    RETURN json_build_object(
        'data', json_build_object(
            '{metric_1_key}', v_{metric_1},   -- e.g. 'total_earnings', 'total_orders_count'
            '{metric_2_key}', v_{metric_2}
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
GRANT EXECUTE ON FUNCTION public.{function_name}(UUID) TO authenticated;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================
COMMENT ON FUNCTION public.{function_name}(UUID) IS
'Returns JSON {data, error} with {description_of_metrics}.
 FARMER scoped to auth.uid(); ADMIN passes specific UUID or NULL for all active farmers.
 Delegates to {helper_1}() and {helper_2}().';
