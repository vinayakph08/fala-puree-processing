// @ts-nocheck
// src/app/(protected)/(main-pages)/[feature]/server-actions/index.ts
// Replace [feature] and schema/controller imports

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { featureController } from "../db-controller";
import { createFeatureSchema, updateFeatureSchema } from "../utils/feature-schema";

export async function createFeatureAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Unauthorized" };

  const rawPayload = {
    farmer_id: user.id,
    name: formData.get("name") as string,
    // add other fields from FormData here
  };

  const validated = createFeatureSchema.safeParse(rawPayload);
  if (!validated.success) {
    return { data: null, error: validated.error.flatten().fieldErrors };
  }

  const { data, error } = await featureController.createItem({ data: validated.data });

  revalidatePath("/feature");

  return { data, error };
}

export async function updateFeatureAction(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Unauthorized" };

  const rawPayload = {
    name: formData.get("name") as string,
    // add other fields from FormData here
  };

  const validated = updateFeatureSchema.safeParse(rawPayload);
  if (!validated.success) {
    return { data: null, error: validated.error.flatten().fieldErrors };
  }

  const { data, error } = await featureController.updateItem({ id, data: validated.data });

  revalidatePath("/feature");
  revalidatePath(`/feature/${id}`);

  return { data, error };
}

export async function deleteFeatureAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Unauthorized" };

  const { data, error } = await featureController.deleteItem({ id });

  revalidatePath("/feature");

  return { data, error };
}
