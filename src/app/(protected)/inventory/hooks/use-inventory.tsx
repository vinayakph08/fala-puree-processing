import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const fetchInventory = async () => {
  try {
    const response = await fetch(`/api/inventory`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
};

export const useInventory = () => {
  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["inventory"],
    queryFn: fetchInventory,
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/inventory?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete inventory item");
      }
      return response.json();
    },
    onSuccess: () => {
      refetch();
      toast.success("Inventory item deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting inventory item:", error);
      toast.error("Failed to delete inventory item");
    },
  });

  const deleteInventoryItem = (id: string) => {
    return deleteMutation.mutateAsync(id);
  };

  return {
    inventory: data,
    error,
    isError,
    isLoading,
    deleteInventoryItem,
    refetchInventory: refetch,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};

// Custom hook for invalidating inventory queries
export const useInvalidateInventory = () => {
  const queryClient = useQueryClient();

  return () => {
    return queryClient.invalidateQueries({
      queryKey: ["inventory"],
    });
  };
};
