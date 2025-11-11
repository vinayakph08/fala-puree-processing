export interface DashboardMetrics {
  totalFarmers: number;
  totalLandSown: number; // in Guntas
  totalInventory: number; // in kg
  currentInventory: number; // in kg
}

export interface FarmerGrowthData {
  month: string;
  farmers: number;
}

export interface InventoryUsageData {
  name: string;
  value: number;
  color: string;
}

export interface InventoryGrowthData {
  month: string;
  inventory: number;
}

export interface CropOption {
  crop_name: string;
  total_quantity: number;
}

export interface FarmerHarvestableInventoryData {
  farmer_id: string;
  farm_id: string;
  farmer_name: string;
  crop_name: string;
  harvestable_quantity: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  farmerGrowth: FarmerGrowthData[];
  inventoryUsage: InventoryUsageData[];
  inventoryGrowth: InventoryGrowthData[];
}
