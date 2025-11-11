import { useQuery } from "@tanstack/react-query";

// Generic fetch hook for any URL
export const useFetch = <T>(url: string, enabled = true) => {
  return useQuery<T>({
    queryKey: [url],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    enabled,
  });
};
