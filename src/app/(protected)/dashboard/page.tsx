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
import { getAllFarmers } from "@/lib/farmers";
import { getInventory } from "@/lib/inventory";

async function DashboardPage() {
  const queryClient = getQueryClient();
  const { user, error: userError } = await getUserFromServerSide();

  if (userError || !user) {
    redirect("/");
  }

  // Prefetch existing data
  await queryClient.prefetchQuery({
    queryKey: ["farmers"],
    queryFn: () => getAllFarmers(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["spinach-inventory"],
    queryFn: () => getInventory(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => getProfileData({ userId: user.id }),
  });

  // Prefetch dashboard data
  await queryClient.prefetchQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: () => getDashboardMetrics(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["farmer-growth"],
    queryFn: () => getFarmerGrowthData(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["inventory-usage"],
    queryFn: () => getInventoryUsageData(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["inventory-growth"],
    queryFn: () => getInventoryGrowthData(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["available-crops"],
    queryFn: () => getAvailableCrops(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["farmer-harvestable-inventory"],
    queryFn: () => getFarmerWithHarvestableInventory(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClientComponent />
    </HydrationBoundary>
  );
}

export default DashboardPage;
