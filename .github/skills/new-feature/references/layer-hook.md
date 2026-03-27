# React Query Hook Layer

## Location

`src/app/(protected)/(main-pages)/[feature]/hooks/use-[feature].tsx`

## Rules — Quick Reference

1. Define `FEATURE_KEYS` as a constant at the top of the file
2. Fetch function is a separate named export (used by both hook and page prefetch)
3. `staleTime` must always be set explicitly — see table below
4. `refetchOnWindowFocus: false` on all queries
5. Always use `mutateAsync` — never `mutate`
6. `onError` must always call both `toast.error` and `console.error`

## staleTime Table

| Feature type | staleTime |
|---|---|
| Orders, tasks | `1000 * 60 * 1` |
| Inventory, earnings | `1000 * 60 * 5` |
| Profile, settings | `1000 * 60 * 30` |

## Cross-Feature Invalidation

If mutation should also clear earnings cache:

```typescript
import { useCacheInvalidation } from "../../earnings/hooks/use-cache-invalidation";
const { invalidateEarnings } = useCacheInvalidation();
// Call in onSuccess after invalidating own keys
```

## Page Prefetch

The fetch function export is reused in `page.tsx` for server-side prefetching:

```typescript
// In page.tsx:
await queryClient.prefetchQuery({
  queryKey: FEATURE_KEYS.all,
  queryFn: fetchFeature,
});
```

## Full Template

See [hook.template.ts](../assets/hook.template.ts)
