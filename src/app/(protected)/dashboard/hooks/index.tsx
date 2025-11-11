import {
  fetchDashboardMetrics,
  fetchFarmerGrowthData,
  fetchInventoryGrowthData,
  fetchInventoryUsageData,
  fetchFarmerHarvestableInventory,
  fetchAvailableCrops,
} from "@/lib/dashboard/client-api";
import { useQuery } from "@tanstack/react-query";

export const useDashboardData = (cropFilter?: string) => {
  // Fetch dashboard data using React Query
  const {
    data: metrics,
    isLoading: isLoadingMetrics,
    error: errorMetrics,
  } = useQuery({
    queryKey: ["dashboard-metrics", cropFilter],
    queryFn: () => fetchDashboardMetrics(cropFilter),
  });

  const {
    data: farmerGrowthData,
    isLoading: isLoadingFarmerGrowth,
    error: errorFarmerGrowth,
  } = useQuery({
    queryKey: ["farmer-growth", cropFilter],
    queryFn: () => fetchFarmerGrowthData(cropFilter),
  });

  const {
    data: inventoryUsageData,
    isLoading: isLoadingInventoryUsage,
    error: errorInventoryUsage,
  } = useQuery({
    queryKey: ["inventory-usage"],
    queryFn: fetchInventoryUsageData,
  });

  const {
    data: inventoryGrowthData,
    isLoading: isLoadingInventoryGrowth,
    error: errorInventoryGrowth,
  } = useQuery({
    queryKey: ["inventory-growth", cropFilter],
    queryFn: () => fetchInventoryGrowthData(cropFilter),
  });

  const {
    data: farmerHarvestableInventoryData,
    isLoading: isLoadingFarmerHarvestableInventory,
    error: errorFarmerHarvestableInventory,
  } = useQuery({
    queryKey: ["farmer-harvestable-inventory", cropFilter],
    queryFn: () => fetchFarmerHarvestableInventory(cropFilter),
  });

  const isLoading =
    isLoadingMetrics ||
    isLoadingFarmerGrowth ||
    isLoadingInventoryUsage ||
    isLoadingInventoryGrowth ||
    isLoadingFarmerHarvestableInventory;

  const error =
    errorMetrics ||
    errorFarmerGrowth ||
    errorInventoryUsage ||
    errorInventoryGrowth ||
    errorFarmerHarvestableInventory;

  return {
    isLoading,
    error,
    metrics,
    farmerGrowthData,
    inventoryUsageData,
    inventoryGrowthData,
    farmerHarvestableInventoryData,
  };
};
