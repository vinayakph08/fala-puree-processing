---
description: "Use when creating or editing hooks files using React Query (useQuery, useMutation, useQueryClient). Covers query keys, staleTime, cache invalidation, mutateAsync."
applyTo: "**/hooks/**"
---

# React Query Hook Rules

## Query Keys — Hierarchical Arrays at Top of File

```typescript
export const FEATURE_KEYS = {
  all: ["feature"],
  byUser: (userId: string) => ["feature", userId],
  detail: (id: string) => ["feature", "detail", id],
};
```

## Query Functions — Imported from `utils/query-functions/`

Do **not** define fetch functions inline in the hook file. Import from the dedicated `utils/query-functions/index.ts`:

```typescript
import { apiGetFeatureList, apiDeleteFeature } from "../utils/query-functions";
```

Naming convention: `api*` prefix. All functions must UNWRAP the HTTP response and return `T` (never `{ data: T }`):

```typescript
// UNWRAP: { data: T } → T  (queryFn must return T, not { data: T })
export const apiGetFeatureList = async (): Promise<IFeatureItem[]> => {
  const response = await fetch("/api/feature");
  if (!response.ok) throw new Error("Failed to fetch feature");
  const { data } = await response.json();
  return data;  // T — never: return { data }
};
```

## useQuery Options

```typescript
useQuery({
  queryKey: FEATURE_KEYS.byUser(userId),
  queryFn: () => fetchFeature(),
  staleTime: 1000 * 60 * 5,   // see staleTime table below
  refetchOnWindowFocus: false,
  retry: 2,                    // queries retry; mutations do not
})
```

## staleTime Convention

| Data | staleTime |
|---|---|
| Orders, tasks (changes frequently) | `1000 * 60 * 1` — 1 min |
| Inventory, earnings | `1000 * 60 * 5` — 5 min |
| Profile, settings (rarely changes) | `1000 * 60 * 30` — 30 min |

## useMutation Rules

- **Always use `mutateAsync`** — never `mutate`
- No retry on mutations (default `retry: 0`)
- `onSuccess`: invalidate cache + show toast
- `onError`: show error toast + `console.error` with context

```typescript
import { apiDeleteFeature } from "../utils/query-functions";

const deleteMutation = useMutation({
  mutationFn: apiDeleteFeature,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.all });
    toast.success("Deleted successfully");
  },
  onError: (error) => {
    console.error("[deleteFeature mutation]", error);
    toast.error("Failed to delete");
  },
});

// Expose as:
deleteFeature: deleteMutation.mutateAsync
```

## Cache Invalidation Rules

| Operation | Invalidate |
|---|---|
| Add / delete | `FEATURE_KEYS.all` |
| Update / toggle | `FEATURE_KEYS.all` + `FEATURE_KEYS.detail(id)` |

## Cross-Feature Invalidation

Use `useCacheInvalidation` hook if earnings or other feature caches must be cleared after a mutation:

```typescript
import { useCacheInvalidation } from "../../earnings/hooks/use-cache-invalidation";
const { invalidateEarnings } = useCacheInvalidation();
```

## Toast Library

`import { toast } from "sonner"` — not react-hot-toast or any other library.

## Full Hook Template

```typescript
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiGetFeatureList, apiDeleteFeature } from "../utils/query-functions";
import { FEATURE_KEYS } from "../utils/query-keys";

export const useFeature = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: FEATURE_KEYS.all,
    queryFn: apiGetFeatureList,  // returns T — RQ wraps it as { data: T | undefined }
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const deleteMutation = useMutation({
    mutationFn: apiDeleteFeature,  // imported from utils/query-functions
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.all });
      toast.success("Deleted successfully");
    },
    onError: (error) => {
      console.error("[deleteFeature mutation]", error);
      toast.error("Failed to delete");
    },
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    deleteFeature: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
```
