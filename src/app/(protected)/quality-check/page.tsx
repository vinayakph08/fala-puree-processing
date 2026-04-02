import { getUserFromServerSide } from "@/lib/auth/get-user";
import { getQueryClient } from "@/lib/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function QualityCheckPage() {
  const queryClient = getQueryClient();
  // const { user, error: userError } = await getUserFromServerSide();

  // if (userError || !user) {
  //   redirect("/");
  // }

  // await Promise.allSettled([
  //   queryClient.prefetchQuery({
  //     queryKey: QC_KEYS.byUser(user.id),
  //     queryFn: () => dbGetQualityTests({ user_id: user.id }),
  //   }),
  // ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='space-y-6'>
        <div>
          <h1 className='text-2xl font-bold'>Quality Check</h1>
          <p className='text-muted-foreground'>
            Manage your Quality Check tasks
          </p>
        </div>

        <div>
          <p>This is the Quality Check page. More content coming soon...</p>
        </div>
      </div>
    </HydrationBoundary>
  );
}
