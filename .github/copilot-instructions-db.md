# Database - AI Coding Instructions

This is a **Supabase-based PostgreSQL database** for a farmer crop inventory management system, with role-based access patterns.

**Critical**: All database functions are consumed as **RPC calls from NextJS frontend** via Supabase client. Design functions with this consumption pattern in mind.

## Core Architecture Patterns

### Database Structure

- **Core entities**: `user_profile` (extends `auth.users`), `farmer_inventory`, `rewards`, `rewards_config`, `farm`, `inventory_images`, `orders`
- **Role-based system**: `FARMER`, `CUSTOMER`, `ADMIN`, `USER` with different access levels
- **Soft deletes**: Use `is_deleted` flags with proper indexing, never hard delete user data
- **Schema qualification**: Always use `public.` prefix on all table and function references — never rely on `search_path`

### Migration Patterns

- **Naming**: `YYYYMMDDHHMMSS_descriptive_name.sql` format
- **Structure**: Always include header comments with purpose, creation date, and functionality description
- **Function organization**: Group related functions with comment blocks (`-- ============================================================================`)
- **Security**: All custom functions use `SECURITY DEFINER` for consistent permissions
- **Language**: Always use `LANGUAGE plpgsql` for `SECURITY DEFINER` functions — never `LANGUAGE sql`. SQL-language functions are inlined by the query planner, which silently discards `SECURITY DEFINER` and exposes raw table access subject to RLS
- **Signature changes**: Always `DROP FUNCTION IF EXISTS` before recreating a function with a different parameter signature. `CREATE OR REPLACE` only works for identical signatures; stale overloads persist silently otherwise
- **Idempotency**: Use `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS` on all DDL statements
- **Grant permissions** explicitly to `authenticated` role at the end of every migration

### Row Level Security (RLS)

- **Always enabled** on user-facing tables
- **Policy patterns**:
  - Farmers: Access only their own data (`auth.uid() = farmer_id`)
  - Customers: Read-only access to available inventory
  - Admins: Full access across all records
  - Use `get_user_role()` helper function consistently
- **INSERT policies**: Never use `WITH CHECK (true)` on user-facing tables. Scope inserts to the service role via triggers (`handle_new_user`) or restrict with a meaningful check condition
- **UPDATE policies**: Always pair `USING` and `WITH CHECK` clauses — `USING` controls which rows can be targeted, `WITH CHECK` controls what values are written
- **Soft delete in RLS**: Do not rely on RLS policies to filter `is_deleted`. Always add `WHERE is_deleted = FALSE` explicitly in every query — see Soft Delete Strategy below

### Soft Delete Strategy

- **Always filter explicitly**: Every `SELECT` query must include `WHERE is_deleted = FALSE`. Do not rely on RLS to enforce this implicitly
- **Write pattern**: When soft-deleting, always set all three fields together: `is_deleted = TRUE`, `deleted_at = TIMEZONE('utc'::text, NOW())`, `deleted_by = auth.uid()`
- **Admin visibility**: Soft-deleted records are not included in standard functions. Admins access deleted records only through dedicated admin functions that explicitly omit or invert the `is_deleted` filter, with a comment marking the intent
- **Child records**: When a parent is soft-deleted, child records retain their own `is_deleted` state. Each table's queries always filter their own `is_deleted` column independently — never infer child state from parent
- **Indexes**: All partial indexes covering active records must include `WHERE is_deleted = FALSE`

### Weekly Rewards System

- **Week definition**: Wednesday to Tuesday cycle (not calendar weeks)
- **Reward types**: `registration`, `add_inventory`, `upload_photo`
- **Validity**: Rewards expire next Wednesday using `get_next_wednesday()` function
- **Status tracking**: `is_valid`, `is_redeemed` with proper invalidation reasons

## Function Design Patterns

> **Use the `create-migration` skill** when writing any new migration or function. It contains the full procedure, SQL templates for every function type, and a post-generation checklist. Type `/create-migration` in Copilot chat to invoke it.

### Function Naming Rules

| Layer / type | Pattern | Examples |
|---|---|---|
| **Layer 1 scalar helper** | `get_{what_it_computes}` — describes the data, no role context | `get_delivered_orders_sum`, `get_total_orders_count` |
| **Layer 2 RPC — read** | `get_{context}_{what_it_returns}` — caller-perspective, domain first | `get_total_orders_earning`, `get_weekly_orders_history` |
| **Layer 2 RPC — dashboard** | `get_{domain}_dashboard_metrics_data` | `get_reward_dashboard_metrics_data` |
| **Layer 2 RPC — write** | `{verb}_{entity}` — verb prefix: `add_`, `update_`, `delete_` | `add_inventory_reward`, `delete_multiple_images` |
| **Admin-scoped functions** | Same naming rules; scope documented in `COMMENT ON FUNCTION`, not the name | `get_total_rewards_earnings` (works for both roles) |

- All functions are prefixed with `public.` — the schema is not part of the name itself.
- Do not encode the role (`admin_get_...`, `farmer_get_...`) in the function name — role behaviour is enforced inside the function body.
- Use `snake_case` throughout. No camelCase, no hyphens.

### Modularization and Composition

Structure functions in two distinct layers:

**Layer 1 — Scalar helper functions** (internal building blocks):
- Pure data access: no auth checks, no role validation
- Always `SECURITY DEFINER` + `LANGUAGE plpgsql` to prevent query planner inlining
- Named to describe the data they return: `get_delivered_orders_sum()`, `get_total_orders_count()`
- Never exposed directly as RPC endpoints — called only by Layer 2 functions
- Accept `p_farmer_id UUID DEFAULT NULL` where NULL means all farmers (admin aggregate path)
- Comment block must state: `-- INTERNAL: not an RPC endpoint`

**Layer 2 — Orchestration functions** (public RPC endpoints):
- Apply auth checks, role validation, and farmer self-lock logic
- Delegate all data access to Layer 1 helpers — no direct table queries
- Return the standard `{data, error}` envelope
- Named from the caller's perspective: `get_total_orders_earning()`, `get_reward_dashboard_metrics_data()`

```sql
-- ============================================================================
-- Layer 1: Pure data helper — INTERNAL: not an RPC endpoint
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_delivered_orders_sum(
    p_farmer_id UUID DEFAULT NULL
) RETURNS NUMERIC AS $$
DECLARE
    result NUMERIC;
BEGIN
    SELECT COALESCE(SUM(total_price), 0)
    INTO result
    FROM public.orders
    WHERE (p_farmer_id IS NULL OR farmer_id = p_farmer_id)
      AND order_status = 'DELIVERED'
      AND is_deleted = FALSE;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Layer 2: Orchestration with auth — RPC endpoint
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_total_orders_earning(
    p_farmer_id UUID
) RETURNS JSON AS $$
DECLARE
    user_role           TEXT;
    effective_farmer_id UUID;
BEGIN
    user_role := public.get_user_role();

    IF user_role = 'FARMER' THEN
        effective_farmer_id := auth.uid();  -- Always lock farmer to self
    ELSIF user_role = 'ADMIN' THEN
        effective_farmer_id := p_farmer_id;
    ELSE
        RETURN json_build_object('data', NULL, 'error', 'Insufficient permissions');
    END IF;

    RETURN json_build_object(
        'data', json_build_object(
            'total_earnings', public.get_delivered_orders_sum(effective_farmer_id)
        ),
        'error', NULL
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('data', NULL, 'error', 'An unexpected error occurred');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Function Return Patterns

**NextJS RPC Consumption**: All functions are called via `supabase.rpc('function_name', params)` from frontend

- **Parameter naming**: Use `p_` prefix (e.g., `p_farmer_id`, `p_page`, `p_limit`) for clarity
- **Null handling**: Always use `COALESCE()` for potentially null aggregates to avoid frontend null issues
- **Pagination**: Always clamp `p_limit` to a safe range using `LEAST(GREATEST(p_limit, 1), 100)`. Never allow unbounded result sets

#### Return Envelope Standard: `{data, error}`

All `RETURNS JSON` functions use exactly two top-level fields — `data` and `error`. There is no `success` field. The frontend derives success from `error IS NULL`.

| Outcome | Pattern |
|---|---|
| Success | `json_build_object('data', <result>, 'error', NULL)` |
| Failure / permission denied | `json_build_object('data', NULL, 'error', '<safe message>')` |
| Unexpected DB error | `json_build_object('data', NULL, 'error', 'An unexpected error occurred')` |

**Never return `SQLERRM` directly** — it exposes internal table names, constraint names, and schema details to the frontend. All `EXCEPTION WHEN OTHERS` handlers must use a fixed user-safe string:

```sql
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('data', NULL, 'error', 'An unexpected error occurred');
```

#### Empty Result Contract

- **`RETURNS TABLE`**: No matching rows → function returns 0 rows; frontend receives `[]`. Never raise an exception for an empty result set
- **`RETURNS JSON` (list payload)**: No data → `json_build_object('data', '[]'::json, 'error', NULL)`
- **`RETURNS JSON` (single object payload)**: No data → `json_build_object('data', NULL, 'error', NULL)` — empty is not an error

#### Use `RETURNS JSON` when:
- Returning a **single aggregate result** (metrics, totals, summaries)
- The function is **composed by another function** (e.g., `get_reward_dashboard_metrics_data` calling `get_total_rewards_earnings`)
- You need the `{data, error}` envelope for conditional logic on the caller side
- Pattern: `json_build_object('data', <object>, 'error', NULL)`
- Error handling: `EXCEPTION WHEN OTHERS THEN RETURN json_build_object('data', NULL, 'error', 'An unexpected error occurred')`

#### Use `RETURNS TABLE(...)` when:
- Returning **multi-row results** (chart series, paginated lists, history data)
- The result is consumed **directly as an array** on the frontend (e.g., chart visualization data)
- Type safety per column matters (PostgreSQL enforces declared types)
- No serialization overhead — avoid wrapping rows in JSON unnecessarily
- Error handling: `RAISE EXCEPTION '...: %', SQLERRM` — Supabase surfaces this as a structured error on the client
- Examples: `get_weekly_rewards_history`, `get_weekly_orders_history`, `get_monthly_combined_earnings`

## Development Workflow

### Essential Commands

```bash
npm run db:start       # Start local Supabase (port 54321 API, 54322 DB)
npm run reset       # Reset with fresh migrations + seed data
npm run migration   # Create new migration file
npm run push        # Apply migrations to remote
npm run up          # Apply pending migrations locally
```

### Migration Best Practices

- **Always test locally** with `reset` before pushing
- **Drop before recreating**: Use `DROP FUNCTION IF EXISTS` when changing a function's parameter signature, before `CREATE OR REPLACE`
- **Update function comments** using `COMMENT ON FUNCTION` syntax
- **Grant permissions** explicitly to `authenticated` role at migration end
- **Schema-qualify everything**: All table and function references use the `public.` prefix

### Testing Database Functions

Always test with an explicit auth context to verify role-based behavior:

```sql
-- Set auth context as a farmer
SET LOCAL request.jwt.claims = '{"sub": "farmer-uuid-here", "role": "authenticated"}';

-- Should return only this farmer's data
SELECT * FROM public.get_current_week_rewards('farmer-uuid-here');

-- Should return {data: null, error: 'Insufficient permissions'} — not another farmer's data
SELECT * FROM public.get_current_week_rewards('other-farmer-uuid');

-- Set auth context as an admin
SET LOCAL request.jwt.claims = '{"sub": "admin-uuid-here", "role": "authenticated"}';
SELECT * FROM public.get_total_current_week_rewards();

-- Unauthenticated — should return error envelope, not data
SET LOCAL request.jwt.claims = '{}';
SELECT * FROM public.get_current_week_rewards('farmer-uuid-here');
```

**Test checklist for every new function:**
- [ ] FARMER role locked to `auth.uid()` regardless of `p_farmer_id` parameter value
- [ ] ADMIN role can access all records
- [ ] Other / unauthenticated roles return `{data: null, error: '...'}` or raise exception
- [ ] Empty result returns the correct empty contract (`[]` or `{data: null, error: null}`) — not a DB error
- [ ] `p_limit` clamping works correctly (test with `0` and `99999`)

### NextJS Integration Examples

```typescript
// Standard RPC call — derive success from error field, no 'success' key exists
const { data, error: supabaseError } = await supabase.rpc("get_current_week_rewards", {
  p_farmer_id: farmerId,
});

// data shape: { data: {...} | null, error: string | null }
const result = data?.data;
const rpcError = data?.error ?? supabaseError?.message;

// Paginated function calls — p_limit is clamped server-side to 1–100
const { data } = await supabase.rpc("get_weekly_earning_table_data", {
  p_farmer_name: searchTerm,
  p_page: 1,
  p_limit: 50,
});
```

## Key Integration Points

### Authentication Flow

- Supabase Auth creates user in `auth.users`
- `handle_new_user()` trigger creates `public.user_profile` from `raw_user_meta_data`
- Required fields: `phone_number`, `first_name`, `last_name`, `role`

### Common Gotchas

- **Rewards week calculations**: Wednesday start, not Monday — use existing `get_current_week_boundaries()`
- **Orders week calculations**: Saturday 18:00 IST start — use existing `get_order_week_boundaries()`. Orders after Saturday 18:00 IST belong to the **next** week. Timezone: `Asia/Kolkata` (UTC+5:30, no DST — safe for all dates)
- **UUID references**: Always use proper foreign key constraints with `ON DELETE CASCADE`
- **Timestamps**: Use `TIMEZONE('utc'::text, NOW())` for consistent UTC storage
- **Role validation**: Check both `user_profile.role` and `user_profile.is_active` in policies
- **Farmer self-lock**: In any function accepting `p_farmer_id`, if the caller is a `FARMER`, always override to `auth.uid()` — never trust the passed parameter value
- **SECURITY DEFINER + SQL language**: Never use `LANGUAGE sql` with `SECURITY DEFINER`. The planner inlines SQL-language functions, silently dropping the definer context and making the function subject to the caller's RLS

## File Organization

- `supabase/migrations/`: Ordered SQL migrations with descriptive names
- `supabase/config.toml`: Local development configuration (ports 54321/54322)
- `package.json`: Database management scripts via Supabase CLI
- `.github/skills/create-migration/`: Copilot skill for generating migrations — templates, patterns reference, and post-generation checklist
