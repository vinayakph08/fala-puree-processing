-- ============================================================================
-- Layer 2: {BATCH_FUNCTION_NAME} — RPC endpoint (batch write)
-- Processes an array of {entity} UUIDs, applying a write operation to each.
-- Tracks per-item outcomes: processed_count (succeeded), skipped_count (not
-- found, already in target state, or filtered out by scope).
--
-- Auth: ADMIN only (adjust role check if other roles need write access).
--
-- p_{entity}_ids  : Array of UUIDs to process (required, must be non-empty).
-- p_{scope_col}   : Mandatory scope — scopes writes to a specific parent record
--                   (e.g. inventory_id, farmer_id). Always required.
-- p_{filter_col}  : Optional additional filter. When NULL it is ignored.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.{batch_function_name}(
    p_{entity}_ids  UUID[],
    p_{scope_col}   UUID,
    p_{filter_col}  UUID DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    user_role       TEXT;
    item_id         UUID;
    rows_affected   INTEGER;
    processed_count INTEGER := 0;
    skipped_count   INTEGER := 0;
BEGIN
    -- Permission check
    user_role := public.get_user_role();
    IF user_role IS NULL OR user_role != 'ADMIN' THEN
        RETURN json_build_object('data', NULL, 'error', 'Insufficient permissions');
    END IF;

    -- Validate input array is non-empty
    IF p_{entity}_ids IS NULL OR array_length(p_{entity}_ids, 1) IS NULL THEN
        RETURN json_build_object('data', NULL, 'error', 'p_{entity}_ids must be a non-empty array');
    END IF;

    -- Process each item individually to track per-item outcomes
    FOREACH item_id IN ARRAY p_{entity}_ids
    LOOP
        -- Soft-delete the item scoped to the mandatory {scope_col}.
        -- Adjust the SET clause and WHERE conditions for your specific operation.
        -- Always set all three soft-delete fields together.
        UPDATE public.{table}
        SET
            is_deleted = TRUE,
            deleted_at = TIMEZONE('utc'::text, NOW()),
            deleted_by = auth.uid()
        WHERE id              = item_id
          AND {scope_col}     = p_{scope_col}
          AND (p_{filter_col} IS NULL OR {filter_col_column} = p_{filter_col})
          AND is_deleted      = FALSE;

        GET DIAGNOSTICS rows_affected = ROW_COUNT;

        IF rows_affected = 0 THEN
            -- Item not found, already deleted, or filtered out by scope — skip
            skipped_count := skipped_count + 1;
            CONTINUE;
        END IF;

        processed_count := processed_count + 1;

        -- -----------------------------------------------------------------------
        -- Optional per-item side-effects — add business logic here as needed.
        -- Examples:
        --
        --   Invalidate a related unredeemed reward:
        --     UPDATE public.rewards
        --     SET    is_valid = FALSE,
        --            invalidation_reason = '{reason}'
        --     WHERE  {entity}_id  = item_id
        --       AND  is_valid      = TRUE
        --       AND  is_redeemed   = FALSE
        --       AND  reward_type   = '{type}';
        --
        --   Call a downstream function:
        --     PERFORM public.{side_effect_function}(item_id);
        -- -----------------------------------------------------------------------

    END LOOP;

    RETURN json_build_object(
        'data', json_build_object(
            'processed_count', processed_count,
            'skipped_count',   skipped_count
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
GRANT EXECUTE ON FUNCTION public.{batch_function_name}(UUID[], UUID, UUID) TO authenticated;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================
COMMENT ON FUNCTION public.{batch_function_name}(UUID[], UUID, UUID) IS
'ADMIN-only batch write. Soft-deletes each item in p_{entity}_ids scoped to p_{scope_col}.
 Returns {data: {processed_count, skipped_count}, error}.
 skipped_count covers items not found, already deleted, or filtered out by optional p_{filter_col}.';
