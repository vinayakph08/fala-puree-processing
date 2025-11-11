import { createClient } from "@/utils/supabase/server";
import { isEmpty } from "lodash";
import { toast } from "sonner";

class FarmersController {
  constructor() {}

  async getAllFarmers() {
    // Logic to retrieve user profile from the database
    const supabase = await createClient();

    try {
      // Fetch user profile from database
      const { data: farmers, error: farmersError } = await supabase
        .from("user_profile")
        .select(
          `*,
          farm:farm (
          farm_id,
          farm_name,
          created_at,
          updated_at
          )
        `
        )
        .eq("role", "FARMER");

      if (farmersError) throw farmersError;
      return { farmers: farmers, error: null };
    } catch (error: any) {
      toast.error(`Error fetching farmers : ${error.message}`);
      return { farmers: null, error };
    }
  }

  async getFarmerById(farmerId: string) {
    const supabase = await createClient();

    try {
      const { data: farmer, error } = await supabase
        .from("user_profile")
        .select(
          `*,
          farm:farm (
          farm_id,
          farm_name,
          created_at,
          updated_at
          )
        `
        )
        .eq("id", farmerId)
        .eq("role", "FARMER")
        .single();

      if (error) throw error;
      return { farmer, error: null };
    } catch (error) {
      console.error("Error fetching farmer by ID:", error);
      return { farmer: null, error };
    }
  }
}

export const farmersController = new FarmersController();

interface IAddInventoryItem {
  farmerId: string;
  crop: string;
  guntas: number;
  sowedDate: string;
}

export type IUpdateInventoryItems = Partial<
  Omit<IAddInventoryItem, "farmerId">
> & {
  id: string;
  farmerId: string;
};

class FarmerInventoryController {
  constructor() {}

  async addInventoryItem({
    farmerId,
    crop,
    guntas,
    sowedDate,
  }: IAddInventoryItem) {
    const supabase = await createClient();

    const inventoryData = {
      farmer_id: farmerId,
      crop_name: crop,
      number_of_guntas: guntas,
      seed_sowed_date: sowedDate,
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from("farmer_inventory")
        .insert(inventoryData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return {
        data: data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message,
      };
    }
  }

  async updateInventoryItem({
    id,
    farmerId,
    crop,
    guntas,
    sowedDate,
  }: IUpdateInventoryItems) {
    const supabase = await createClient();

    const updateData = {};
    !isEmpty(crop) && (updateData["crop_name"] = crop);
    !isEmpty(sowedDate) && (updateData["seed_sowed_date"] = sowedDate);
    updateData["number_of_guntas"] = guntas;

    try {
      const { data, error } = await supabase
        .from("farmer_inventory")
        .update(updateData)
        .eq("id", id)
        .eq("farmer_id", farmerId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        data: data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message,
      };
    }
  }

  async deleteInventoryItem({ id }: { id: string }) {
    const supabase = await createClient();

    try {
      const { data: deletedData, error } = await supabase.rpc(
        "soft_delete_inventory",
        { inventory_id: id }
      );
      if (error) {
        throw new Error(error.message);
      }
      return {
        data: deletedData,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message,
      };
    }
  }

  async restoreDeletedInventoryItem({ id }: { id: string }) {
    const supabase = await createClient();
    try {
      const { data: restoredData, error } = await supabase.rpc(
        "restore_inventory",
        { inventory_id: id }
      );

      if (error) {
        throw new Error(error.message);
      }
      return {
        data: restoredData,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message,
      };
    }
  }

  async getInventoryItemById({
    farmerId,
    id,
  }: {
    farmerId: string;
    id: string;
  }) {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase
        .from("farmer_inventory")
        .select("*")
        .eq("id", id)
        .eq("farmer_id", farmerId)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return {
        data: data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message,
      };
    }
  }

  async getInventoryByFarmerId(farmerId: string) {
    const supabase = await createClient();

    try {
      const { data: inventory, error } = await supabase
        .from("farmer_inventory")
        .select("*")
        .eq("farmer_id", farmerId)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { inventory, error: null };
    } catch (error) {
      console.error("Error fetching farmer inventory:", error);
      return { inventory: null, error };
    }
  }

  async getAllSpinachInventory() {
    const supabase = await createClient();
    try {
      const { data, error } = await supabase
        .from("farmer_inventory")
        .select("*")
        .eq("crop_name", "Spinach")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
}

export const farmerInventoryController = new FarmerInventoryController();
