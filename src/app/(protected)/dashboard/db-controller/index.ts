import { createClient } from "@/utils/supabase/server";
import { DashboardData, DashboardMetrics } from "@/types/dashboard";
import { isEmpty } from "lodash";

class DashboardController {
  /**
   * Get key dashboard metrics with optional crop filter
   */
  async getDashboardMetrics(cropFilter?: string): Promise<{
    metrics: DashboardMetrics | null;
    error: any;
  }> {
    try {
      const supabase = await createClient();

      // Single query to get all key metrics
      const { data, error } = await supabase.rpc("get_dashboard_metrics", {
        crop_filter: cropFilter || null,
      });

      if (error) throw error;

      return {
        metrics: {
          totalFarmers: data?.[0]?.total_farmers || 0,
          totalLandSown: data?.[0]?.total_land_sown || 0,
          totalInventory: data?.[0]?.total_inventory || 0,
          currentInventory: data?.[0]?.current_inventory || 0,
        },
        error: null,
      };
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      return { metrics: null, error };
    }
  }

  /**
   * Get farmer growth data for chart with optional crop filter
   */
  async getFarmerGrowthData(
    cropFilter?: string
  ): Promise<{ data: any[] | null; error: any }> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase.rpc("get_farmer_growth_data", {
        crop_filter: cropFilter || null,
      });

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      console.error("Error fetching farmer growth data:", error);
      return { data: null, error };
    }
  }

  /**
   * Get inventory usage distribution for pie chart
   */
  async getInventoryUsageData(): Promise<{ data: any[] | null; error: any }> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase.rpc("get_inventory_usage_data");

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      console.error("Error fetching inventory usage data:", error);
      return { data: null, error };
    }
  }

  /**
   * Get inventory growth data for bar chart with optional crop filter
   */
  async getInventoryGrowthData(
    cropFilter?: string
  ): Promise<{ data: any[] | null; error: any }> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase.rpc("get_inventory_growth_data", {
        crop_filter: cropFilter || null,
      });

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      console.error("Error fetching inventory growth data:", error);
      return { data: null, error };
    }
  }

  /**
   * Get available crops for dropdown
   */
  async getAvailableCrops(): Promise<{ data: any[] | null; error: any }> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase.rpc("get_available_crops");

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      console.error("Error fetching available crops:", error);
      return { data: null, error };
    }
  }

  /**
   * Get farmer and their total harvestable inventory
   */
  async getFarmerHarvestableInventory(cropFilter?: string): Promise<{
    data: any[] | null;
    error: any;
  }> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase.rpc(
        "get_farmer_harvestable_inventory",
        {
          crop_filter: cropFilter || null,
        }
      );

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      console.error("Error fetching farmer harvestable inventory:", error);
      return { data: null, error };
    }
  }

  /**
   * Get all dashboard data in a single call
   */
  async getAllDashboardData(): Promise<{
    dashboardData: DashboardData | null;
    error: any;
  }> {
    try {
      // Execute all queries in parallel for better performance
      const [
        metricsResult,
        farmerGrowthResult,
        inventoryUsageResult,
        inventoryGrowthResult,
      ] = await Promise.all([
        this.getDashboardMetrics(),
        this.getFarmerGrowthData(),
        this.getInventoryUsageData(),
        this.getInventoryGrowthData(),
      ]);

      // Check for any errors
      if (
        metricsResult.error ||
        farmerGrowthResult.error ||
        inventoryUsageResult.error ||
        inventoryGrowthResult.error
      ) {
        throw new Error("One or more dashboard queries failed");
      }

      const dashboardData: DashboardData = {
        metrics: metricsResult.metrics!,
        farmerGrowth: farmerGrowthResult.data || [],
        inventoryUsage: inventoryUsageResult.data || [],
        inventoryGrowth: inventoryGrowthResult.data || [],
      };

      return { dashboardData, error: null };
    } catch (error) {
      console.error("Error fetching all dashboard data:", error);
      return { dashboardData: null, error };
    }
  }
}

export const dashboardController = new DashboardController();
