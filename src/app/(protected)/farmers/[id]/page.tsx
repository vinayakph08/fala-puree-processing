import React from "react";
import { getQueryClient } from "@/lib/query-client";
import { getUserFromServerSide } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import FarmerClientComponent from "./farmer-client-component";
import { farmerInventoryController, farmersController } from "../db-controller";

const getFarmerById = async (id: string) => {
  const { farmer, error } = await farmersController.getFarmerById(id);
  if (error) {
    throw new Error(error);
  }
  return farmer;
};

const getFarmerInventoryById = async (id: string) => {
  const { inventory, error } =
    await farmerInventoryController.getInventoryByFarmerId(id);
  if (error) {
    throw new Error(error);
  }
  return inventory;
};

async function FarmerPage({ params }: { params: any }) {
  const queryClient = getQueryClient();
  const { user, error: userError } = await getUserFromServerSide();

  const { id } = await params;
  if (userError || !user) {
    redirect("/");
  }

  await queryClient.prefetchQuery({
    queryKey: ["farmer", id],
    queryFn: async () => getFarmerById(id),
  });

  await queryClient.prefetchQuery({
    queryKey: ["farmerInventory", id],
    queryFn: async () => getFarmerInventoryById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <h1 className='text-2xl font-bold mb-4'>Farmer Details</h1>
        {/* Render farmer details here */}
        <FarmerClientComponent params={{ id }} />
      </div>
    </HydrationBoundary>
  );
}

export default FarmerPage;
