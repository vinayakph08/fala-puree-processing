// Client-side API functions for dashboard data
import { DashboardMetrics, DashboardData } from "@/types/dashboard";

const API_BASE = "/api/dashboard";

export const fetchDashboardMetrics = async (
  cropFilter?: string
): Promise<DashboardMetrics> => {
  const url = cropFilter
    ? `${API_BASE}/metrics?crop=${encodeURIComponent(cropFilter)}`
    : `${API_BASE}/metrics`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard metrics: ${response.status}`);
  }

  const { metrics } = await response.json();
  return metrics;
};

export const fetchFarmerGrowthData = async (
  cropFilter?: string
): Promise<any[]> => {
  const url = cropFilter
    ? `${API_BASE}/farmer-growth?crop=${encodeURIComponent(cropFilter)}`
    : `${API_BASE}/farmer-growth`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch farmer growth data: ${response.status}`);
  }

  const { data } = await response.json();
  return data || [];
};

export const fetchInventoryUsageData = async (): Promise<any[]> => {
  const response = await fetch(`${API_BASE}/inventory-usage`);

  if (!response.ok) {
    throw new Error(`Failed to fetch inventory usage data: ${response.status}`);
  }

  const { data } = await response.json();
  return data || [];
};

export const fetchInventoryGrowthData = async (
  cropFilter?: string
): Promise<any[]> => {
  const url = cropFilter
    ? `${API_BASE}/inventory-growth?crop=${encodeURIComponent(cropFilter)}`
    : `${API_BASE}/inventory-growth`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch inventory growth data: ${response.status}`
    );
  }

  const { data } = await response.json();
  return data || [];
};

export const fetchFarmerHarvestableInventory = async (
  cropFilter?: string
): Promise<any[]> => {
  const url = cropFilter
    ? `${API_BASE}/farmer-harvestable-inventory?crop=${encodeURIComponent(
        cropFilter
      )}`
    : `${API_BASE}/farmer-harvestable-inventory`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch farmer harvestable inventory: ${response.status}`
    );
  }

  const { data } = await response.json();
  return data || [];
};

export const fetchAvailableCrops = async (): Promise<any[]> => {
  const response = await fetch(`${API_BASE}/available-crops`);

  if (!response.ok) {
    throw new Error(`Failed to fetch available crops: ${response.status}`);
  }

  const { data } = await response.json();
  return data || [];
};

export const fetchAllDashboardData = async (): Promise<DashboardData> => {
  const response = await fetch(`${API_BASE}/all`);

  if (!response.ok) {
    throw new Error(`Failed to fetch all dashboard data: ${response.status}`);
  }

  const { dashboardData } = await response.json();
  return dashboardData;
};
