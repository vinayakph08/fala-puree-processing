---
description: "Use when creating or editing db-controller files. Covers class pattern, Supabase client creation, return shape, error handling, and RPC usage."
applyTo: "**/db-controller/**"
---

# DB Controller Rules

## Structure

- Class-based: `[Feature]Controller`
- Export a singleton: `export const featureController = new FeatureController()`
- `createClient` is **async** — call `await createClient()` inside each method, not in the constructor
- Import from `@/utils/supabase/server`

## Return Shape — Always `DbResult<T>`

Import type: `import type { DbResult } from "@/types"`

- Success: `{ data: T, error: null }`
- Failure: `{ data: null, error: error.message }`
- **Never add `success: boolean`** — `error !== null` is the only failure signal
- **Never throw** out of a controller method
- **Never expose** raw Supabase error objects to callers
- Annotate every method explicitly: `async getItems(...): Promise<DbResult<IFeatureItem[]>>`

## Error Handling Pattern

Wrap every method in try/catch. Re-throw Supabase errors as `Error` inside the try block so the catch can normalize them:

```typescript
try {
  const { data, error } = await supabase.from("table").select("*");
  if (error) throw new Error(error.message);
  return { data, error: null };
} catch (error: any) {
  return { data: null, error: error.message };
}
```

## Rules

- No auth checks inside controllers — auth is the API Route's responsibility
- No business logic — pure DB operations only
- Use RPC for complex operations: `supabase.rpc("rpc_name", { p_param: value })`
- Soft deletes via RPC: `supabase.rpc("soft_delete_[feature]", { p_[feature]_id: id })`
- Restore via RPC: `supabase.rpc("restore_[feature]", { [feature]_id: id })`

## Template

```typescript
import { createClient } from "@/utils/supabase/server";
import type { DbResult } from "@/types";
import { IFeatureItem, FeatureInsert } from "@/types/feature";

class FeatureController {
  async getItems({ farmer_id }: { farmer_id: string }): Promise<DbResult<IFeatureItem[]>> {
    const supabase = await createClient();
    try {
      const { data, error } = await supabase
        .from("feature_table")
        .select("*")
        .eq("farmer_id", farmer_id)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async createItem({ data }: { data: FeatureInsert }): Promise<DbResult<IFeatureItem>> {
    const supabase = await createClient();
    try {
      const { data: result, error } = await supabase
        .from("feature_table")
        .insert(data)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return { data: result, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async updateItem({ id, data }: { id: string; data: Partial<FeatureInsert> }) {
    const supabase = await createClient();
    try {
      const { data: result, error } = await supabase
        .from("feature_table")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return { data: result, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async deleteItem({ id }: { id: string }) {
    const supabase = await createClient();
    try {
      const { data, error } = await supabase.rpc("soft_delete_feature", {
        p_feature_id: id,
      });
      if (error) throw new Error(error.message);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }
}

export const featureController = new FeatureController();
```
