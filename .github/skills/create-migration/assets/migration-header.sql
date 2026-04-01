-- Migration: {MIGRATION_TITLE}
-- Created: {YYYY-MM-DD}
-- Purpose:
--   {DESCRIBE_WHAT_THIS_MIGRATION_DOES_LINE_1}
--   {DESCRIBE_WHAT_THIS_MIGRATION_DOES_LINE_2}
--   Add one bullet per major change or function introduced.

-- ============================================================================
-- {SECTION_1_NAME}
-- e.g. "SCALAR HELPER FUNCTIONS", "TABLE CREATION", "RPC FUNCTIONS"
-- ============================================================================

-- {function or table definition goes here}

-- ============================================================================
-- {SECTION_2_NAME}  -- add/remove sections as needed
-- ============================================================================

-- {next function or definition}

-- ============================================================================
-- GRANTS AND PERMISSIONS
-- ============================================================================

-- Add one GRANT line per function defined in this migration.
GRANT EXECUTE ON FUNCTION public.{function_name}({param_type_list}) TO authenticated;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

-- Add one COMMENT per function. State: role behaviour, index used, return shape.
COMMENT ON FUNCTION public.{function_name}({param_type_list}) IS
'{Description. Example: Returns JSON {data, error} with total delivered order earnings.
 FARMER scoped to auth.uid(); ADMIN passes specific UUID or NULL for all active farmers.
 Delegates to get_delivered_orders_sum(). Uses idx_orders_earnings partial index.}';
