import { getQueryClient } from "@/lib/query-client";
import { getUserFromServerSide } from "@/lib/auth/get-user";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { EditTestClient } from "./components/edit-test-client";
import { QC_KEYS } from "@/app/(protected)/(main-pages)/quality-check/utils/query-keys";
import { dbGetQualityTestById } from "@/app/(protected)/(main-pages)/quality-check/utils/server-functions";

export default async function QualityCheckDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = getQueryClient();
  const { user, error: userError } = await getUserFromServerSide();

  if (userError || !user) {
    redirect("/");
  }

  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: QC_KEYS.detail(id),
      queryFn: () => dbGetQualityTestById(id),
      staleTime: Infinity,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditTestClient id={id} />
    </HydrationBoundary>
  );
}
