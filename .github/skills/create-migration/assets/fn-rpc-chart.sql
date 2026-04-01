-- ============================================================================
-- Layer 2: {CHART_FUNCTION_NAME} — RPC endpoint (time-series chart)
-- Returns {p_periods_back} calendar {period_type}s of {entity} data for chart visualization.
-- FARMER: always scoped to auth.uid().
-- ADMIN:  p_{entity}_id IS NOT NULL → specific {entity}.
--         p_{entity}_id IS NULL     → all active {entities}.
--
-- Uses RETURNS TABLE — Supabase surfaces rows as an array on the frontend.
-- Zero-activity periods are included via LEFT JOIN — no gaps in the series.
-- Error handling: RAISE EXCEPTION (not JSON envelope) — Supabase returns a
-- structured error object to the frontend for RETURNS TABLE functions.
--
-- Pattern: month-based using DATE_TRUNC('month').
-- For week-based charts, replace the period_series CTE with generate_series
-- anchored to get_order_week_boundaries() or get_current_week_boundaries().
-- ============================================================================
CREATE OR REPLACE FUNCTION public.{chart_function_name}(
    p_{entity}_id  UUID DEFAULT NULL,
    p_periods_back INT  DEFAULT {default_periods}  -- e.g. 6 for months, 8 for weeks
)
RETURNS TABLE(
    period_start        DATE,
    period_end          DATE,
    period_label        TEXT,         -- e.g. 'Mar 2026' for months, '28 Mar' for weeks
    period_number       INT,          -- 1 = most recent period, counts upward (oldest = p_periods_back)
    {metric_col_1}      NUMERIC,      -- primary metric, e.g. orders_earnings
    {metric_col_2}      NUMERIC,      -- secondary metric; remove if only one source
    total_{metric}      NUMERIC,      -- combined total; remove if only one source
    is_current_period   BOOLEAN
) AS $$
DECLARE
    user_role             TEXT;
    effective_{entity}_id UUID;
BEGIN
    user_role := public.get_user_role();

    IF user_role = 'FARMER' THEN
        effective_{entity}_id := auth.uid();
    ELSIF user_role = 'ADMIN' THEN
        effective_{entity}_id := p_{entity}_id;
    ELSE
        RAISE EXCEPTION 'Insufficient permissions';
    END IF;

    RETURN QUERY
    WITH period_series AS (
        -- Generate p_periods_back calendar months back from today (IST).
        -- For weeks: replace 'month' with 'week' and adjust INTERVAL.
        SELECT
            DATE_TRUNC('month',
                (NOW() AT TIME ZONE 'Asia/Kolkata') - (n * INTERVAL '1 month')
            )::DATE AS period_start
        FROM generate_series(0, p_periods_back - 1) AS n
    ),
    period_boundaries AS (
        SELECT
            ps.period_start,
            (ps.period_start + INTERVAL '1 month' - INTERVAL '1 day')::DATE AS period_end,
            (ROW_NUMBER() OVER (ORDER BY ps.period_start DESC))::INT         AS period_number,
            TO_CHAR(ps.period_start, 'Mon YYYY')                             AS period_label,
            -- Format for weeks: TO_CHAR(ps.period_start, 'DD Mon')
            (DATE_TRUNC('month', (NOW() AT TIME ZONE 'Asia/Kolkata'))::DATE
                = ps.period_start)                                           AS is_current_period
        FROM period_series ps
    ),
    -- Aggregate primary data source per period
    {primary_table}_agg AS (
        SELECT
            DATE_TRUNC('month', t.{date_col} AT TIME ZONE 'Asia/Kolkata')::DATE AS period_start,
            COALESCE(SUM(t.{amount_col}), 0)                                    AS {metric_col_1}
        FROM public.{primary_table} t
        INNER JOIN public.user_profile up ON t.{entity_id_column} = up.id
        WHERE t.is_deleted = FALSE
          AND up.role      = 'FARMER'
          AND up.is_active = TRUE
          -- AND t.{status_col} = '{status_value}'   -- e.g. AND t.order_status = 'DELIVERED'
          AND (effective_{entity}_id IS NULL OR t.{entity_id_column} = effective_{entity}_id)
        GROUP BY DATE_TRUNC('month', t.{date_col} AT TIME ZONE 'Asia/Kolkata')::DATE
    ),
    -- Optional: second data source CTE (e.g. combine orders + rewards on one chart).
    -- Remove this CTE and the LEFT JOIN below if only one metric source is needed.
    {secondary_table}_agg AS (
        SELECT
            DATE_TRUNC('month', s.{secondary_date_col} AT TIME ZONE 'Asia/Kolkata')::DATE AS period_start,
            COALESCE(SUM(s.{secondary_amount_col}), 0)                                    AS {metric_col_2}
        FROM public.{secondary_table} s
        INNER JOIN public.user_profile up ON s.{entity_id_column} = up.id
        WHERE s.is_valid  = TRUE          -- adjust condition for secondary table
          AND up.role     = 'FARMER'
          AND up.is_active = TRUE
          AND (effective_{entity}_id IS NULL OR s.{entity_id_column} = effective_{entity}_id)
        GROUP BY DATE_TRUNC('month', s.{secondary_date_col} AT TIME ZONE 'Asia/Kolkata')::DATE
    )
    SELECT
        pb.period_start,
        pb.period_end,
        pb.period_label,
        pb.period_number,
        COALESCE(p.{metric_col_1}, 0)::NUMERIC                                      AS {metric_col_1},
        COALESCE(s.{metric_col_2}, 0)::NUMERIC                                      AS {metric_col_2},
        (COALESCE(p.{metric_col_1}, 0) + COALESCE(s.{metric_col_2}, 0))::NUMERIC   AS total_{metric},
        pb.is_current_period
    FROM period_boundaries pb
    LEFT JOIN {primary_table}_agg   p ON p.period_start = pb.period_start
    LEFT JOIN {secondary_table}_agg s ON s.period_start = pb.period_start  -- remove if single source
    ORDER BY pb.period_start DESC;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to execute {chart_function_name}: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANTS AND PERMISSIONS
-- ============================================================================
GRANT EXECUTE ON FUNCTION public.{chart_function_name}(UUID, INT) TO authenticated;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================
COMMENT ON FUNCTION public.{chart_function_name}(UUID, INT) IS
'Returns {p_periods_back} calendar {period_type}s of {entity} chart data (RETURNS TABLE).
 FARMER scoped to auth.uid(); ADMIN passes specific UUID or NULL for all active farmers.
 Zero-activity periods included via LEFT JOIN. Ordered newest-first.';
