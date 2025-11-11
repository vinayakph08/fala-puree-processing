"use client";

import { useState } from "react";
import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InventoryFormDialog } from "../inventory-form-dialog";
import { InventoryItem } from "../../types";

interface EditInventoryButtonProps {
  farmerId: string;
  editItem: InventoryItem;
  onSuccess?: () => void;
}

export function EditInventoryButton({ farmerId, editItem, onSuccess }: EditInventoryButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsDialogOpen(true)}
      >
        <Edit2 className="h-4 w-4" />
      </Button>
      
      <InventoryFormDialog
        farmerId={farmerId}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editItem={editItem}
        onSuccess={onSuccess}
      />
    </>
  );
}