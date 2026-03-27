// @ts-nocheck
// src/app/(protected)/(main-pages)/[feature]/utils/server-functions/index.ts
//
// PURPOSE: Server-side DB controller wrappers.
// USED IN: page.tsx (inside prefetchQuery's queryFn)
// DO NOT import in client components or hooks — use query-functions instead.
// Naming convention: db* prefix — these call db-controller directly, server-side only

import { featureController } from "../../db-controller";

// UNWRAP: DbResult<IFeatureItem[]> → IFeatureItem[]
// queryFn must return T so React Query stores T, not DbResult<T>
export const dbGetFeatureList = async ({ farmer_id }: { farmer_id: string }) => {
  const { data, error } = await featureController.getItems({ farmer_id });
  if (error) throw new Error(error);  // RQ treats thrown error as query error
  return data;                         // T — never return { data } here
};

// UNWRAP: DbResult<IFeatureItem> → IFeatureItem
export const dbGetFeatureById = async ({ id }: { id: string }) => {
  const { data, error } = await featureController.getItemById({ id });
  if (error) throw new Error(error);
  return data;
};
