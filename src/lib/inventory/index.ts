import { farmerInventoryController } from "@/app/(protected)/farmers/db-controller";
import { inventoryController } from "@/app/(protected)/inventory/db-controller";

export const getInventory = async () => {
  try {
    const inventory = await inventoryController.getAllInventoryItems();
    return inventory.data;
  } catch (error) {
    throw error;
  }
};

export const getAllSpinachInventory = async () => {
  try {
    const inventory = await farmerInventoryController.getAllSpinachInventory();
    return inventory;
  } catch (error) {
    throw error;
  }
};
