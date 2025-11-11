import React from "react";
import { getUserFromServerSide } from "@/lib/auth/get-user";
import { getQueryClient } from "@/lib/query-client";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getProfileData } from "@/lib/profile";
import FarmersListClientComponent from "./components/client-component";
import { getAllFarmers } from "@/lib/farmers";

async function FarmersPage() {
  const queryClient = getQueryClient();
  const { user, error: userError } = await getUserFromServerSide();

  if (userError || !user) {
    redirect("/");
  }

  await queryClient.prefetchQuery({
    queryKey: ["farmers"],
    queryFn: () => getAllFarmers(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => getProfileData({ userId: user.id }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FarmersListClientComponent />
    </HydrationBoundary>
  );
}

export default FarmersPage;
