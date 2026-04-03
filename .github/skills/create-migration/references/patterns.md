# Migration Patterns — Full Rule Reference

This is the authoritative rule reference for all Fala Processing SQL migrations.

---

## `{data, error}` Return Envelope

All `RETURNS JSON` functions use exactly **two** top-level fields. No `success` field.

| Outcome | Pattern |
|---|---|
| Success | `json_build_object('data', <result>, 'error', NULL)` |
| Permission denied / business rule failure | `json_build_object('data', NULL, 'error', '<safe message>')` |
| Unexpected DB error | `json_build_object('data', NULL, 'error', 'An unexpected error occurred')` |

**Never** return `SQLERRM` directly — it exposes table names, constraint names, and schema internals to the frontend.

---

## Empty Result Contracts

| Return type | No data found |
|---|---|
| `RETURNS TABLE` | Returns 0 rows → frontend receives `[]`. Never raise an exception for an empty result. |
| `RETURNS JSON` — list payload | `json_build_object('data', '[]'::json, 'error', NULL)` |
| `RETURNS JSON` — single object | `json_build_object('data', NULL, 'error', NULL)` — empty is not an error |

---

## Layer 1 vs Layer 2

| Layer | Rules |
|---|---|
| **Layer 1 — scalar helper** | No auth checks. Returns raw type (`NUMERIC`, `BIGINT`, `TEXT`). `p_farmer_id DEFAULT NULL` (NULL = all farmers). Header comment must include `-- INTERNAL: not an RPC endpoint`. |
| **Layer 2 — RPC endpoint** | Auth + role gate first. Delegates all data access to Layer 1 helpers — no direct table queries. Returns `{data, error}` JSON envelope or `RETURNS TABLE`. |

---

## Soft Delete

- Every `SELECT` must include `WHERE is_deleted = FALSE` — do not rely on RLS to enforce this.
- When soft-deleting, always set **all three fields** together:

```sql
is_deleted = TRUE,
deleted_at = TIMEZONE('utc'::text, NOW()),
deleted_by = auth.uid()
```

- Admins see deleted records only in dedicated admin functions that explicitly invert the filter.

---

## Farmer Self-Lock

In any function accepting `p_farmer_id`, always override when the caller is a `FARMER`:

```sql
IF user_role = 'FARMER' THEN
    effective_farmer_id := auth.uid();        -- ignore passed parameter
ELSIF user_role = 'ADMIN' THEN
    effective_farmer_id := p_farmer_id;       -- NULL = all active farmers
ELSE
    RETURN json_build_object('data', NULL, 'error', 'Insufficient permissions');
END IF;
```

---

## `plpgsql` Mandate

Always `LANGUAGE plpgsql SECURITY DEFINER`. **Never** `LANGUAGE sql`.

SQL-language functions are inlined by the query planner, silently discarding `SECURITY DEFINER` and making the function subject to the caller's RLS on the underlying tables.

---

## Schema Qualification

All table and function references must use the `public.` prefix. Never rely on `search_path`.

---

## `p_limit` Clamping

Apply before every `LIMIT` clause. Prevents unbounded result sets from a single RPC call.

```sql
safe_limit := LEAST(GREATEST(p_limit, 1), 100);
```

---

## Pagination Strategy — Offset vs Cursor

Choose the pagination type before selecting a template.

| Use **offset-based** (`fn-rpc-search-paginated.sql`) when… | Use **cursor-based** (`fn-rpc-cursor-paginated.sql`) when… |
|---|---|
| Admin table views where users jump to arbitrary pages | Infinite-scroll feed or "load more" UX |
| Dataset is bounded (< ~10k rows) | Dataset is large or grows rapidly with frequent inserts |
| Sort column changes per request | Deep page navigation is not required |
| Frontend needs `total_count` and `total_pages` | Stable results even when new records are inserted mid-navigation |

**Offset weakness**: `OFFSET 5000` scans and discards 5000 rows — degrades on large datasets and can show duplicates/skips when records are inserted between page fetches.

**Cursor rule**: The cursor must always be a **composite** of `(sort_column, id)` — never a single timestamp. A timestamp-only cursor breaks when two records share the same millisecond.

---

## Offset Pagination Metadata

Use `COUNT(*) OVER()` window function inside the paginated CTE — single DB pass, no separate count query.

---

## Cursor Pagination

**Use cursor pagination** for infinite scroll / "load more" UX, large datasets, or when result stability on inserts matters.  
**Use offset pagination** for page-jump UX, admin tables, or bounded datasets where `total_count` is required.

**Cursor key rule**: Always use a **composite** `(sort_column, id)` — never a timestamp alone. Two records can share the same millisecond; `id` breaks the tie so no row is skipped or duplicated.

```sql
-- Parameters
p_cursor_ts  TIMESTAMPTZ DEFAULT NULL,  -- created_at of the last seen row; NULL = first page
p_cursor_id  UUID        DEFAULT NULL,  -- id of the last seen row; NULL = first page

-- Cursor predicate in WHERE — skips everything already seen
AND (
    p_cursor_ts IS NULL OR p_cursor_id IS NULL
    OR (t.created_at, t.id) < (p_cursor_ts, p_cursor_id)
)
-- Sort must match cursor direction
ORDER BY t.created_at DESC, t.id DESC
LIMIT safe_limit + 1  -- extra row detects has_next_page without a COUNT query

-- In the JSON response (no total_count, no total_pages)
'next_cursor',   CASE WHEN has_next THEN json_build_object('ts', last_row.created_at, 'id', last_row.id) ELSE NULL END,
'has_next_page', has_next
```

**has_next_page detection**: Fetch `safe_limit + 1` rows. If the result set contains more than `safe_limit` rows, a next page exists. Return only `safe_limit` rows to the frontend and use the last real row as `next_cursor`.

```sql
-- Inside paginated CTE:
SELECT *, COUNT(*) OVER() AS total_count FROM filtered ORDER BY ... LIMIT safe_limit OFFSET p_page * safe_limit

-- In the JSON response:
'total_count',       COALESCE(MAX(total_count), 0),
'total_pages',       COALESCE(CEIL(MAX(total_count)::DECIMAL / NULLIF(safe_limit, 0)), 0),
'has_previous_page', p_page > 0,
'has_next_page',     (p_page + 1) * safe_limit < COALESCE(MAX(total_count), 0)
```

---

## Dynamic Sort (Safe — No Dynamic SQL)

Use a CASE expression per allowed column. The allowlist prevents SQL injection.

```sql
-- Allowlist sort column
safe_sort_col := CASE p_sort_by
    WHEN 'created_at'   THEN 'created_at'
    WHEN 'order_date'   THEN 'order_date'
    WHEN 'total_price'  THEN 'total_price'
    ELSE 'created_at'   -- default fallback
END;

-- Allowlist sort direction
safe_sort_dir := CASE UPPER(TRIM(p_sort_dir)) WHEN 'ASC' THEN 'ASC' ELSE 'DESC' END;

-- Use in ORDER BY (one CASE pair per allowed column):
ORDER BY
    CASE WHEN safe_sort_col = 'created_at'  AND safe_sort_dir = 'DESC' THEN created_at  END DESC NULLS LAST,
    CASE WHEN safe_sort_col = 'created_at'  AND safe_sort_dir = 'ASC'  THEN created_at  END ASC  NULLS LAST,
    CASE WHEN safe_sort_col = 'order_date'  AND safe_sort_dir = 'DESC' THEN order_date  END DESC NULLS LAST,
    CASE WHEN safe_sort_col = 'order_date'  AND safe_sort_dir = 'ASC'  THEN order_date  END ASC  NULLS LAST
```

---

## Composed Function Error Check

When composing multiple Layer 2 functions, check `->>'error' IS NULL` (not `->>'success'`):

```sql
IF (sub_result_1->>'error') IS NULL
   AND (sub_result_2->>'error') IS NULL THEN
    -- compose result
ELSE
    RETURN json_build_object('data', NULL, 'error', 'One or more metrics failed to load');
END IF;
```

---

## Migration Signature Change Rule

`CREATE OR REPLACE` only works when the parameter signature is identical. If parameters changed:

```sql
DROP FUNCTION IF EXISTS public.{function_name}({old_param_type_list});
CREATE OR REPLACE FUNCTION public.{function_name}({new_params}) ...
```

Stale overloads persist silently and can be called unintentionally by the frontend.

---

## Function Naming Rules

| Layer / type | Pattern | Examples |
|---|---|---|
| **Layer 1 scalar helper** | `get_{what_it_computes}` — describes the data, no role context | `get_delivered_orders_sum`, `get_total_orders_count` |
| **Layer 2 RPC — read** | `get_{context}_{what_it_returns}` — caller-perspective, domain first | `get_total_orders_earning`, `get_weekly_orders_history` |
| **Layer 2 RPC — dashboard** | `get_{domain}_dashboard_metrics_data` | `get_reward_dashboard_metrics_data` |
| **Layer 2 RPC — write** | `{verb}_{entity}` — verb prefix: `add_`, `update_`, `delete_` | `add_inventory_reward`, `delete_multiple_images` |

- All functions use `public.` prefix — the schema is not part of the name itself.
- Never encode role in function name (`admin_get_...` ❌, `farmer_get_...` ❌) — role behaviour is enforced inside the function body.
- `snake_case` throughout. No camelCase, no hyphens.

---

## Domain Gotchas

- **Batch stage ordering**: Stages are fixed in sequence (Sorting & Cleaning → Blanching → Quenching → Cutting → Grinding → Packaging → Freezing). Store a `stage` enum or integer and never allow out-of-order inserts.
- **Quality test types**: Two test types exist — `standard` (Color, Texture, Viscosity, Taste & Flavour) and `cooking_stress` (Color, Taste). Store with a `test_type` discriminator column; enforce with a CHECK constraint.
- **Quality test images**: Every quality test result must be linked to at least one image. Enforce a NOT NULL FK at the DB level — do not rely on application logic alone.
- **Grade values**: `grade` is always one of `'A'`, `'B'`, `'C'`. Enforce with a `CHECK (grade IN ('A', 'B', 'C'))` constraint — never free text.
- **Batch traceability**: Every stage record and quality test result must include `batch_id` as a FK. Never allow orphaned records.
- **Role validation**: Check both `user_profile.role` and `user_profile.is_active` in policies. Roles are `PROCESSING_WORKER`, `QUALITY_INSPECTOR`, `SUPERVISOR`.
