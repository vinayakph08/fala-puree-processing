import { useQuery } from "@tanstack/react-query";

export const useFarmer = ({ farmerId }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["farmer", farmerId],
    queryFn: async () => {
      const response = await fetch(`/api/farmer/${farmerId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.data;
    },
  });

  return { data, error, isLoading };
};
