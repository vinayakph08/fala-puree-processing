// @ts-nocheck
// src/app/(protected)/(main-pages)/[feature]/utils/query-keys/index.ts
//
// PURPOSE: React Query cache key constants for this feature.
// USED IN: hooks/use-[feature].tsx (queryKey, invalidateQueries)
//          page.tsx (prefetchQuery queryKey)
// These are constants, not utility functions — they live in their own folder.

import { FeatureFilters } from "@/types/feature";

export const FEATURE_KEYS = {
  all: ["feature"],                                                          // invalidates entire feature cache
  byUser: (userId: string) => ["feature", userId],                          // all items for a farmer
  detail: (id: string) => ["feature", "detail", id],                        // single item
  search: (filters: FeatureFilters) => ["feature", "search", filters],      // filtered/paginated results
};