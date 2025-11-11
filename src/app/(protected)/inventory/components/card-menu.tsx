"use client";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { DeleteIcon, EllipsisVerticalIcon, Trash2Icon } from "lucide-react";
import { use } from "react";
import { useInventory } from "../hooks/use-inventory";

function CardMenu({ cardId }: { cardId: string }) {
  const { deleteInventoryItem } = useInventory();
  const handleDelete = async () => {
    // Handle delete action
    try {
      await deleteInventoryItem(cardId);
    } catch (error) {
      console.error("Error deleting inventory item:", error);
    }
  };

  return (
    <Menubar className='border-none shadow-none h-5'>
      <MenubarMenu>
        <MenubarTrigger className='p-1'>
          <EllipsisVerticalIcon className='h-4 w-4 text-muted-foreground' />
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem
            className='flex justify-start items-center text-red-500'
            onClick={handleDelete}
          >
            <Trash2Icon className='ml-2 h-4 w-4' color='#fb2c36' />
            <span>Delete</span>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export default CardMenu;
