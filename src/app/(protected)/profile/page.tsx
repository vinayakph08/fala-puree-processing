import { getQueryClient } from "@/lib/query-client";
import { getUserFromServerSide } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ProfileClientComponent from "./components/client-component";
import { getProfileData } from "@/lib/profile";

export default async function ProfilePage() {
  const queryClient = getQueryClient();
  const { user, error: userError } = await getUserFromServerSide();

  if (userError || !user) {
    redirect("/");
  }

  await queryClient.prefetchQuery({
    queryKey: ["profile", user.id],
    queryFn: () => getProfileData({ userId: user.id }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileClientComponent />
    </HydrationBoundary>
  );
}
