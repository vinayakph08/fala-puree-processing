"use server";

import { revalidatePath } from "next/cache";
import { inventoryController } from "../db-controller";
import { createClient } from "@/utils/supabase/server";

export async function addInventoryAction(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Extract and validate form data
  const cropData = {
    farmer_id: user?.id,
    crop_name: formData.get("crop_name") as string,
    number_of_guntas: parseFloat(formData.get("number_of_guntas") as string),
    seed_sowed_date: formData.get("seed_sowed_date"),
    created_at: new Date().toISOString(),
  };

  const { data, error } = await inventoryController.createInventoryItem({
    data: cropData,
  });

  revalidatePath("/inventory");

  return {
    data,
    error,
  };
}

export async function deleteInventoryAction(inventoryId: string) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await inventoryController.deleteInventoryItem({
    id: inventoryId,
  });

  revalidatePath("/inventory");

  return {
    data,
    error,
  };
}
