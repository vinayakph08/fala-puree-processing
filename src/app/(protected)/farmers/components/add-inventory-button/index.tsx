"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InventoryFormDialog } from "../inventory-form-dialog";

interface AddInventoryButtonProps {
  farmerId: string;
  onSuccess?: () => void;
}

export function AddInventoryButton({ farmerId, onSuccess }: AddInventoryButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        <PlusIcon className='h-4 w-4' color='#fff' />
        <span>Add Crop</span>
      </Button>
      
      <InventoryFormDialog
        farmerId={farmerId}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={onSuccess}
      />
    </>
  );
}
