# Data Shape Transformation Chain

Every value flows through 4 boundaries. Each boundary either **WRAPS** or **UNWRAPs**.

```
[DB Controller]          ─PRODUCES─▶  DbResult<T>
                                           ↓
[Server Function (db*)]    UNWRAPS to T   (throws on error — RQ stores T, not DbResult<T>)
[API Route]                UNWRAPS to T   (then re-WRAPs as { data: T } in HTTP body)
                                           ↓
[Query Function (api*)]    UNWRAPS to T   (extracts from HTTP response body)
                                           ↓
[React Query useQuery]     WRAPS as        { data: T | undefined, isLoading, error }
                                           ↓
[Component]                reads T directly via hook return value
```

## The Single Rule

> **React Query stores `T` — never `{ data: T }`.**
> Every function that feeds a `queryFn` must return `T`, not a wrapper object.

---

## DbResult\<T\> — DB Boundary Type

```ts
// src/types/index.ts
export type DbResult<T> = {
  data: T | null;
  error: string | null;  // sanitized message, never raw Supabase error object
};
```

- `error !== null` is the **only** failure signal — never add `success: boolean`
- `data` is always `T | null` — never `{ success, data: T }`

---

## Layer-by-Layer Pattern

### DB Controller → produces `DbResult<T>`

```ts
import type { DbResult } from "@/types";

async getItems({ farmer_id }): Promise<DbResult<IFeatureItem[]>> {
  try {
    const { data, error } = await supabase.from("...").select("*")
    if (error) throw new Error(error.message)
    return { data, error: null }          // data = T
  } catch (err: any) {
    return { data: null, error: err.message }
  }
}
```

### Server Function (`db*`) → UNWRAPS `DbResult<T>` to `T`

```ts
// UNWRAP: DbResult<IFeatureItem[]> → IFeatureItem[]
// queryFn must return T — RQ stores T, not DbResult<T>
export const dbGetFeatureList = async ({ farmer_id }) => {
  const { data, error } = await featureController.getItems({ farmer_id })
  if (error) throw new Error(error)  // RQ treats thrown error as query error
  return data                         // T, not { data: T }
}
```

### API Route → UNWRAPS `DbResult<T>`, re-WRAPs as HTTP body

```ts
// UNWRAP: DbResult<T> → T
const { data, error } = await featureController.getItems({ farmer_id: user.id })
if (error) return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })

// WRAP: T → { data: T } (HTTP envelope)
return NextResponse.json({ data }, { status: 200 })
```

### Query Function (`api*`) → UNWRAPS HTTP body to `T`

```ts
// UNWRAP: { data: T } → T
// queryFn must return T so RQ stores T, not { data: T }
const response = await fetch("/api/feature")
const { data } = await response.json()
return data   // T — if you return the whole response, component reads data.data
```

### React Query Hook → receives `T`, exposes `T`

React Query wraps `queryFn`'s return in `{ data: T | undefined, isLoading, error }` automatically.

```ts
const { data, isLoading, error } = useQuery({ queryFn: apiGetFeatureList })
// data is IFeatureItem[] | undefined — NOT { data: IFeatureItem[] }
```

---

## Common Mistakes

| Mistake | Layer | Symptom |
|---|---|---|
| `return { data: result }` from `queryFn` | query-function | Component reads `data.data` |
| `return { success, data, error }` from controller | db-controller | Consumers check `success` AND `error` inconsistently |
| `queryFn: () => controller.getItems()` in client hook | hook | `DbResult<T>` stored in RQ; component reads `data.data` |
| Forgot to unwrap in server-function | server-function | Prefetched cache holds `{ data: T }`; component reads `data.data` |
