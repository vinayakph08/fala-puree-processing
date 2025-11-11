"use client";

import React from "react";
import { FarmDetails } from "@/app/(protected)/farmers/components/farm-details";
import { InventoryDetails } from "@/app/(protected)/farmers/components/inventory-details";
import { useFarmerInventory } from "../../hooks/use-farmer-inventory";
import { useFarmer } from "../../hooks/use-farmer";
import { getMappedFarmerData, getMappedInventoryData } from "../../utils";
import { addInventoryType, FarmDetailsData, InventoryItem } from "../../types";
import { AddCropForm } from "@/app/(protected)/inventory/components/add-crop-form";

function FarmerClientComponent({ params }) {
  const { id } = params; // Farmer ID from route

  const {
    data: farmerData,
    isLoading: isFarmerLoading,
    error: farmerError,
  } = useFarmer({ farmerId: id });

  const { data: inventoryData, deleteInventoryItem } = useFarmerInventory({
    farmerId: id,
  });

  const handleDeleteInventory = async (id: string) => {
    await deleteInventoryItem(id);
  };

  return (
    <div className='container mx-auto py-6 space-y-6'>
      {/* Farm Details Section */}
      <FarmDetails data={getMappedFarmerData(farmerData)} />
      {/* Inventory Details Section */}
      <InventoryDetails
        farmerId={id}
        data={getMappedInventoryData(inventoryData)}
        onDelete={handleDeleteInventory}
      />
    </div>
  );
}

export default FarmerClientComponent;
