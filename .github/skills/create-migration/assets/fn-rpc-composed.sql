-- ============================================================================
-- Layer 2: {DASHBOARD_FUNCTION_NAME} — RPC endpoint (composed dashboard)
-- Assembles a single dashboard payload from multiple Layer 2 functions.
-- Each sub-function is called independently; results are combined only if
-- all sub-functions return error = NULL.
--
-- Auth: ADMIN only (adjust role check below if FARMER access is also needed).
--
-- Sub-functions composed:
--   - public.{sub_function_1}()          → {sub_1_description}
--   - public.{sub_function_2}()          → {sub_2_description}
--   - public.{sub_function_3}(NULL)      → {sub_3_description} (NULL = all farmers)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.{dashboard_function_name}()
RETURNS JSON AS $$
DECLARE
    {sub_result_1}  JSON;   -- result from public.{sub_function_1}()
    {sub_result_2}  JSON;   -- result from public.{sub_function_2}()
    {sub_result_3}  JSON;   -- result from public.{sub_function_3}(NULL)
    result_data     JSON;
BEGIN
    -- Collect results from each sub-function independently
    SELECT public.{sub_function_1}()     INTO {sub_result_1};
    SELECT public.{sub_function_2}()     INTO {sub_result_2};
    SELECT public.{sub_function_3}(NULL) INTO {sub_result_3};

    -- Compose only if all sub-functions succeeded (error = NULL means success)
    IF ({sub_result_1}->>'error') IS NULL
       AND ({sub_result_2}->>'error') IS NULL
       AND ({sub_result_3}->>'error') IS NULL THEN

        result_data := json_build_object(
            'data', json_build_object(
                -- Embed the full sub-result data object:
                '{key_1}', {sub_result_1}->'data',

                -- Or extract a specific scalar value from a sub-result:
                -- '{key_2}', ({sub_result_2}->'data'->>'total_{entity}')::INT,
                '{key_2}', {sub_result_2}->'data',

                '{key_3}', {sub_result_3}->'data'
            ),
            'error', NULL
        );
    ELSE
        result_data := json_build_object(
            'data', NULL,
            'error', 'One or more dashboard metrics failed to load'
        );
    END IF;

    RETURN result_data;

EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('data', NULL, 'error', 'An unexpected error occurred');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANTS AND PERMISSIONS
-- ============================================================================
GRANT EXECUTE ON FUNCTION public.{dashboard_function_name}() TO authenticated;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================
COMMENT ON FUNCTION public.{dashboard_function_name}() IS
'Composed dashboard function. Calls {sub_function_1}, {sub_function_2}, {sub_function_3}
 and assembles their results into a single payload. Returns {data, error} envelope.
 ADMIN only. Returns error if any sub-function fails.';
