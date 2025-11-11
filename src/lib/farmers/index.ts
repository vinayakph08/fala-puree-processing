import { farmersController } from "@/app/(protected)/farmers/db-controller";

export const getAllFarmers = async () => {
  try {
    const { farmers, error } = await farmersController.getAllFarmers();
    if (error) throw error;
    return farmers;
  } catch (error) {
    console.error("Error fetching all farmers:", error);
    throw error;
  }
};

export const getFarmerById = async (farmerId: string) => {
  try {
    const { farmer, error } = await farmersController.getFarmerById(farmerId);
    if (error) throw error;
    return farmer;
  } catch (error) {
    console.error("Error fetching farmer by ID:", error);
    throw error;
  }
};
