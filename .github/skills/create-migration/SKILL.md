---
name: create-migration
description: 'Create Supabase PostgreSQL migration files for the Fala App database. Use for: writing new SQL migrations, creating RPC functions (aggregate with scalar helpers, composed dashboard, search + filter + pagination + sort, chart time-series, batch write over UUID arrays), adding tables, indexes, RLS policies, or triggers. Enforces SECURITY DEFINER, plpgsql, data/error envelope, soft-delete filtering, farmer self-lock, p_limit clamping, and grant patterns.'
argument-hint: 'Describe the migration: purpose, function type(s), table(s) involved, and which roles need access (FARMER / ADMIN / both)'
---

# Create Migration

Generates a correct, standards-compliant Supabase SQL migration for the Fala App database.
All patterns follow [copilot-instructions.md](../../copilot-instructions.md) as the source of truth.
Quick-reference rules are in [references/patterns.md](./references/patterns.md).

## When to Use

- Writing a new migration file under `supabase/migrations/`
- Adding or modifying any database function (RPC endpoint or internal helper)
- Creating new tables, indexes, RLS policies, or triggers
- Refactoring an existing function's signature or business logic

## Pre-Generation Interview

Ask the user these questions before choosing a template:

1. **Purpose** — What should this migration do? (new function, new table, fix existing function, add index, add RLS policy)
2. **Function type** — Which best describes the output?
   - Single aggregate/metric (totals, counts, summaries)
   - Composed dashboard (combines results from multiple existing functions)
   - Paginated list with search, filter, and sort
   - Time-series rows for a chart
   - Batch write over an array of IDs
   - Pure internal scalar helper (no auth, called by other functions only)
3. **Role access** — Who can call this? (FARMER only, ADMIN only, both)
4. **Data source** — Which table(s)? Does it join `user_profile`?
5. **Write or read** — Does it modify data (INSERT, UPDATE, soft-delete) or only SELECT?
6. **Composition** — Does it call other existing functions and combine their results?
7. **Pagination type** (if a list function) — Does the frontend need page-jumping and total counts (offset), or infinite scroll / load-more with stable results on inserts (cursor)?

## Function Type Decision Tree

| If the function… | Template |
|---|---|
| Returns a raw NUMERIC / BIGINT scalar — no auth, called only by other functions | [fn-scalar-helper.sql](./assets/fn-scalar-helper.sql) |
| Returns a single JSON aggregate object; delegates to Layer 1 scalar helpers | [fn-rpc-aggregate.sql](./assets/fn-rpc-aggregate.sql) |
| Combines results from 2+ Layer 2 functions into one dashboard payload | [fn-rpc-composed.sql](./assets/fn-rpc-composed.sql) |
| Returns a paginated, searchable, filterable, sortable list — admin table, page-jump UX, bounded dataset | [fn-rpc-search-paginated.sql](./assets/fn-rpc-search-paginated.sql) |
| Returns a cursor-paginated list — infinite scroll, large/fast-growing dataset, stable on inserts | [fn-rpc-cursor-paginated.sql](./assets/fn-rpc-cursor-paginated.sql) |
| Returns time-series rows for chart visualization (`RETURNS TABLE`) | [fn-rpc-chart.sql](./assets/fn-rpc-chart.sql) |
| Writes (soft-delete / update) to an array of IDs in a loop | [fn-rpc-batch-write.sql](./assets/fn-rpc-batch-write.sql) |

A single migration can contain multiple sections — for example, one scalar helper (Layer 1) plus one aggregate RPC (Layer 2) that calls it.
Use [migration-header.sql](./assets/migration-header.sql) for the file-level boilerplate.

## Procedure

1. Run the pre-generation interview to clarify requirements.
2. Select the correct template(s) from the decision tree.
3. Load the template file(s); consult [references/patterns.md](./references/patterns.md) for rule reminders.
4. Run `npm run db:migration` to generate the timestamped filename, then write to:
   `supabase/migrations/YYYYMMDDHHMMSS_descriptive_name.sql`
5. Substitute every `{PLACEHOLDER}` with real names, columns, and types.
6. Ensure all table and function references use the `public.` prefix.
7. Apply the post-generation checklist before finalising.

## Post-Generation Checklist

- [ ] File named `YYYYMMDDHHMMSS_descriptive_name.sql` — timestamp matches current date/time
- [ ] Header comment block present: migration title, created date, purpose description
- [ ] `DROP FUNCTION IF EXISTS public.{name}({old_param_types})` present if the function's parameter signature changed from a previous version (`CREATE OR REPLACE` only works for identical signatures)
- [ ] All `CREATE TABLE` and `CREATE INDEX` use `IF NOT EXISTS`
- [ ] All table and function references use `public.` prefix — no bare unqualified names
- [ ] All functions use `LANGUAGE plpgsql SECURITY DEFINER` — never `LANGUAGE sql`
- [ ] Every `SELECT` query includes `WHERE is_deleted = FALSE` — never rely on RLS for this
- [ ] FARMER role always overrides to `auth.uid()` — never trusts the passed `p_farmer_id` parameter value
- [ ] Return envelope is `{data, error}` — no `success` field anywhere
- [ ] `EXCEPTION WHEN OTHERS` returns the fixed string `'An unexpected error occurred'` — no `SQLERRM` in production-facing errors
- [ ] `GRANT EXECUTE ON FUNCTION public.{name}(...) TO authenticated` block at the end
- [ ] `COMMENT ON FUNCTION public.{name}(...)` present describing purpose, role behaviour, and index used
