// @ts-nocheck
// src/app/(protected)/(main-pages)/[feature]/page.tsx
// Server Component — default export required for Next.js pages

import { getUserFromServerSide } from "@/lib/auth/get-user";
import { getQueryClient } from "@/lib/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
// FEATURE_KEYS lives in utils/query-keys — separate from utility functions
import { FEATURE_KEYS } from "./utils/query-keys";
// server-functions call DB controller directly — safe for server components
// api* functions from query-functions use fetch() and are NOT safe here
import { dbGetFeatureList } from "./utils/server-functions";
import { FeatureClientComponent } from "./components/client-component";

async function FeaturePage() {
  const queryClient = getQueryClient();
  const { user, error: userError } = await getUserFromServerSide();

  if (userError || !user) {
    redirect("/");
  }

  // Prefetch all queries the page needs — use Promise.allSettled so one
  // failing prefetch does not block the rest of the page from rendering
  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: FEATURE_KEYS.byUser(user.id),
      queryFn: () => dbGetFeatureList({ farmer_id: user.id }),
    }),
    // Add more prefetchQuery calls here if the page needs more data
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FeatureClientComponent />
    </HydrationBoundary>
  );
}

export default FeaturePage;
