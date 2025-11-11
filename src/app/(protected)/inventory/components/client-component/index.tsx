"use client";
import React from "react";
import InventoryPageHeader from "../header";
import InventorySummary from "../Inventory-summary";
import { useInventory } from "../../hooks/use-inventory";

function InventoryClientComponent() {
  const { inventory, isLoading, error } = useInventory();

  if (error) {
    return <div>Error fetching inventory</div>;
  }

  return (
    <div className='space-y-6'>
      <InventoryPageHeader />
      <InventorySummary inventory={inventory} />
    </div>
  );
}

export default InventoryClientComponent;
