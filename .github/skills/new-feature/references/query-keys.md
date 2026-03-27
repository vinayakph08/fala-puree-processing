# Query Keys

## Location

`src/app/(protected)/(main-pages)/[feature]/utils/query-keys/index.ts`

FEATURE_KEYS lives in its own `utils/query-keys/` folder — separate from utility functions and schemas. Imported by both hooks (client) and page.tsx (server) without circular dependencies.

## Naming Convention

```typescript
export const FEATURE_KEYS = {
  all: ["feature"],                                        // invalidate everything for this feature
  byUser: (userId: string) => ["feature", userId],         // all items for a specific farmer
  detail: (id: string) => ["feature", "detail", id],       // single item
  search: (filters: FeatureFilters) => ["feature", "search", filters], // filtered/searched results
};
```

## Rules

- Key names are **lowercase string literals** — never variables or constants for the root string
- Always hierarchical — child keys start with the parent key's value
- `all` is always `["feature"]` — invalidating `all` clears every cache entry for the feature
- Filters/params go at the **end** of the array, never in the middle

## Usage in Hooks

```typescript
// useQuery
queryKey: FEATURE_KEYS.byUser(user.id)

// Invalidate all after add/delete
queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.all })

// Invalidate both list and detail after update
queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.all })
queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.detail(id) })
```

## Usage in page.tsx (server prefetch)

```typescript
import { FEATURE_KEYS } from "./utils/query-keys";

await queryClient.prefetchQuery({
  queryKey: FEATURE_KEYS.byUser(user.id),
  queryFn: () => getFeature({ farmer_id: user.id }),  // from utils/server-functions
});
```

## Cache Invalidation Reference

| Operation | Keys to Invalidate |
|---|---|
| Create / Delete | `FEATURE_KEYS.all` |
| Update | `FEATURE_KEYS.all` + `FEATURE_KEYS.detail(id)` |
| Cross-feature (earnings, rewards) | call `useCacheInvalidation()` from earnings hook |
