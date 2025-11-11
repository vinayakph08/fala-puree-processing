import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useFarmerInventory = ({ farmerId }) => {
  // useQuery to fetch farmer inventory
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["farmerInventory", farmerId],
    queryFn: async () => {
      const response = await fetch(
        `/api/farmer/inventory?farmerId=${farmerId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.data;
    },
    refetchOnWindowFocus: false,
  });

  // useMutation to add, update, delete inventory items
  const udpateInventoryMutation = useMutation({
    mutationFn: async (updateData: any) => {
      const response = await fetch("/api/farmer-inventory", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        throw new Error("Failed to update inventory item");
      }
      return response.json();
    },
    onSuccess: () => {
      refetch();
      toast.success("Inventory item updated successfully");
    },
    onError: (error) => {
      toast.error(`Error updating inventory item: ${error.message}`);
    },
  });

  const deleteInventoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/farmer/inventory?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete inventory item");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Inventory item deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Error deleting inventory item: ${error.message}`);
    },
  });

  // Function to update an existing inventory item
  const updateInventoryItem = (item: any) => {
    return udpateInventoryMutation.mutateAsync(item);
  };

  // Function to delete an inventory item
  const deleteInventoryItem = (id: string) => {
    return deleteInventoryMutation.mutateAsync(id);
  };

  // return data and mutation functions
  return {
    data,
    error,
    isLoading,
    updateInventoryItem,
    deleteInventoryItem,
    refetchInventory: refetch,
    isUpdating: udpateInventoryMutation.isPending,
    isDeleting: deleteInventoryMutation.isPending,
    updateError: udpateInventoryMutation.error,
    deleteError: deleteInventoryMutation.error,
  };
};

// Custom hook for invalidating inventory queries
export const useInvalidateFarmerInventory = () => {
  const queryClient = useQueryClient();

  return (farmerId: string) => {
    return queryClient.invalidateQueries({
      queryKey: ["farmerInventory", farmerId],
    });
  };
};
