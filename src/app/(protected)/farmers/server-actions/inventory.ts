"use server";

import { revalidatePath } from "next/cache";
import {
  farmerInventoryController,
  IUpdateInventoryItems,
} from "../db-controller";

export async function addFarmerInventoryAction({
  formData,
}: {
  formData: FormData;
}) {
  // Extract and validate form data
  const cropData = {
    farmer_id: formData.get("farmer_id") as string,
    crop_name: formData.get("crop_name") as string,
    number_of_guntas: parseFloat(formData.get("number_of_guntas") as string),
    seed_sowed_date: formData.get("seed_sowed_date"),
  };

  const { data, error } = await farmerInventoryController.addInventoryItem({
    farmerId: cropData.farmer_id,
    crop: cropData.crop_name,
    guntas: cropData.number_of_guntas,
    sowedDate: cropData.seed_sowed_date as string,
  });

  revalidatePath("/farmer/" + cropData.farmer_id);

  return {
    data,
    error,
  };
}

export async function updateInventoryAction(formData: FormData) {
  const id = formData.get("inventory_id") as string;
  const farmerId = formData.get("farmer_id") as string;

  if (!id) {
    return { data: null, error: "Missing inventory item ID" };
  }

  const updateData: IUpdateInventoryItems = {
    farmerId: farmerId,
    id: id,
  };

  if (formData.get("number_of_guntas")) {
    updateData.guntas = parseFloat(formData.get("number_of_guntas") as string);
  }
  if (formData.get("seed_sowed_date")) {
    updateData.sowedDate = formData.get("seed_sowed_date") as string;
  }

  const { data, error } = await farmerInventoryController.updateInventoryItem(
    updateData
  );

  if (farmerId) {
    revalidatePath("/farmer/" + farmerId);
  }

  return {
    data,
    error,
  };
}
