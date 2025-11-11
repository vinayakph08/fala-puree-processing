import { createClient } from "@/utils/supabase/server";

class InventoryController {
  constructor() {}

  async createInventoryItem({ data }: { data: any }) {
    const supabase = await createClient();
    try {
      const { data: insertedData, error } = await supabase
        .from("farmer_inventory")
        .insert(data)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return {
        data: insertedData,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message,
      };
    }
  }

  async updateInventoryItem({ id, data }: { id: string; data: any }) {
    const supabase = await createClient();
    try {
      const { data: updatedData, error } = await supabase
        .from("farmer_inventory")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return {
        data: updatedData,
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
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

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

  async getAllInventoryById(inventoryId: string) {
    // get only single farmer's inventory items
    const supabase = await createClient();

    try {
      const { data, error } = await supabase
        .from("farmer_inventory")
        .select("*")
        .eq("id", inventoryId)
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

  async getAllInventoryItems() {
    // get only single farmer's inventory items
    const supabase = await createClient();

    try {
      const { data, error } = await supabase
        .from("farmer_inventory")
        .select("*")
        .order("created_at", { ascending: false });
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
}

export const inventoryController = new InventoryController();
