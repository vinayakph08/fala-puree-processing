import React from "react";
import {
  getAllDashboardData,
  getDashboardMetrics,
  getFarmerGrowthData,
  getInventoryUsageData,
  getInventoryGrowthData,
  getAvailableCrops,
  getFarmerWithHarvestableInventory,
} from "@/lib/dashboard";
import { getUserFromServerSide } from "@/lib/auth/get-user";
import { getQueryClient } from "@/lib/query-client";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import DashboardClientComponent from "./components/client-component";
import { getProfileData } from "@/lib/profile";

async function DashboardPage() {
  const queryClient = getQueryClient();
  const { user, error: userError } = await getUserFromServerSide();

  if (userError || !user) {
    redirect("/");
  }

  await queryClient.prefetchQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => getProfileData({ userId: user.id }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClientComponent />
    </HydrationBoundary>
  );
}

export default DashboardPage;
