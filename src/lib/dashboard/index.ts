import { dashboardController } from "@/app/(protected)/dashboard/db-controller";

export const getDashboardMetrics = async (cropFilter?: string) => {
  try {
    const { metrics, error } = await dashboardController.getDashboardMetrics(
      cropFilter
    );
    if (error) throw error;
    return metrics;
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    throw error;
  }
};

export const getUserGrowthData = async (cropFilter?: string) => {
  try {
    const { data, error } = await dashboardController.getUserGrowthData(
      cropFilter
    );
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user growth data:", error);
    throw error;
  }
};

export const getInventoryUsageData = async () => {
  try {
    const { data, error } = await dashboardController.getInventoryUsageData();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching inventory usage data:", error);
    throw error;
  }
};

export const getInventoryGrowthData = async (cropFilter?: string) => {
  try {
    const { data, error } = await dashboardController.getInventoryGrowthData(
      cropFilter
    );
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching inventory growth data:", error);
    throw error;
  }
};

export const getAvailableCrops = async () => {
  try {
    const { data, error } = await dashboardController.getAvailableCrops();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching available crops:", error);
    throw error;
  }
};

export const getUserWithHarvestableInventory = async (
  cropFilter?: string
) => {
  try {
    const { data, error } =
      await dashboardController.getUserHarvestableInventory(cropFilter);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching users with harvestable inventory:", error);
    throw error;
  }
};

export const getAllDashboardData = async () => {
  try {
    const { dashboardData, error } =
      await dashboardController.getAllDashboardData();
    if (error) throw error;
    return dashboardData;
  } catch (error) {
    console.error("Error fetching all dashboard data:", error);
    throw error;
  }
};
