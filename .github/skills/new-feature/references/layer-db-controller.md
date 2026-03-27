# DB Controller Layer

## Location

`src/app/(protected)/(main-pages)/[feature]/db-controller/index.ts`

## Rules — Quick Reference

1. Class-based — `[Feature]Controller`
2. `await createClient()` is called **inside each method** — it is async
3. Always return `DbResult<T>` = `{ data: T | null, error: string | null }` — **never throw out of a method**
4. **Never add `success: boolean`** — `error !== null` is the only failure signal
5. Annotate every method's return type explicitly: `Promise<DbResult<IFeatureItem[]>>`
6. Wrap with try/catch; throw Supabase errors inside the try block to normalize in catch
7. No auth checks — auth belongs in the API Route
8. Export a **singleton**: `export const featureController = new FeatureController()`

See [data-shapes reference](./data-shapes.md) for the full transformation chain across all layers.

## Supabase Import

```typescript
import { createClient } from "@/utils/supabase/server";
```

## Common Query Patterns

```typescript
// Select all for a farmer
await supabase.from("table").select("*").eq("farmer_id", farmer_id).eq("is_deleted", false)

// Select with related data
await supabase.from("table").select("*, related_table(*)")

// Insert and return
await supabase.from("table").insert(data).select().single()

// Update and return
await supabase.from("table").update(data).eq("id", id).select().single()

// RPC call
await supabase.rpc("function_name", { p_param: value })
```

## Full Template

See [db-controller.template.ts](../assets/db-controller.template.ts)
