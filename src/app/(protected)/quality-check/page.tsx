import { getUserFromServerSide } from "@/lib/auth/get-user";
import { getQueryClient } from "@/lib/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { QC_KEYS } from "./utils/query-keys";
import { dbGetQualityTests } from "./utils/server-functions";
import { QualityCheckDashboard } from "./components/quality-check-dashboard";

export default async function QualityCheckPage() {
  const queryClient = getQueryClient();
  const { user, error: userError } = await getUserFromServerSide();

  if (userError || !user) {
    redirect("/");
  }

  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: QC_KEYS.byUser(user.id),
      queryFn: () => dbGetQualityTests({ user_id: user.id }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QualityCheckDashboard />
    </HydrationBoundary>
  );
}
