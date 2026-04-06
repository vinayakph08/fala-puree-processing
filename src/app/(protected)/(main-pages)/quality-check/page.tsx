import { getUserFromServerSide } from "@/lib/auth/get-user";
import { getQueryClient } from "@/lib/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { QC_KEYS } from "./utils/query-keys";
import { dbSearchQualityTests } from "./utils/server-functions";
import { QualityCheckDashboard } from "./components/quality-check-dashboard";

export default async function QualityCheckPage() {
  const queryClient = getQueryClient();
  const { user, error: userError } = await getUserFromServerSide();

  if (userError || !user) {
    redirect("/");
  }

  const defaultParams = { page: 0, limit: 20 };

  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: QC_KEYS.search(defaultParams),
      queryFn: () => dbSearchQualityTests(defaultParams),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QualityCheckDashboard />
    </HydrationBoundary>
  );
}
