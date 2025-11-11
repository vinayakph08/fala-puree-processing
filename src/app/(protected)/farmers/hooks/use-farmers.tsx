import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getMappedData } from "../utils";
import { useCallback, useState } from "react";

interface FarmerSearchParams {
  searchKey?: string;
  page?: number;
  pageSize?: number;
}

const fetchFarmers = async ({
  searchKey = "",
  page = 1,
  pageSize = 10,
}: FarmerSearchParams) => {
  const searchParams = new URLSearchParams();

  searchKey && searchParams.append("search", searchKey);
  page !== undefined && searchParams.append("page", page.toString());
  pageSize && searchParams.append("pageSize", pageSize.toString());

  try {
    const response = await fetch(
      `/api/farmer/search?${searchParams.toString()}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching farmers:", error);
    throw error;
  }
};

export const useFarmers = () => {
  const [searchParams, setSearchParams] = useState<FarmerSearchParams>({
    searchKey: "",
    page: 0,
    pageSize: 10,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [`farmers`, ...Object.values(searchParams)],
    queryFn: () => fetchFarmers(searchParams),
    select: (data) => {
      return {
        data: getMappedData(data?.farmers),
        pagination: data?.pagination,
      };
    }, // Adjust this based on your API response structure
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });

  const updatePagination = useCallback(
    (newParams: Partial<FarmerSearchParams>) => {
      setSearchParams((prev) => ({
        ...prev,
        ...newParams,
        // page: newParams.searchKey !== undefined ? 0 : prev.page,
      }));
    },
    []
  );

  const updateSearch = useCallback((newSearchKey: string) => {
    setSearchParams((prev) => ({
      ...prev,
      searchKey: newSearchKey,
      page: 0, // Reset to first page on new search
    }));
  }, []);

  return {
    data,
    isLoading,
    error,
    pagination: data?.pagination,
    updatePagination,
    updateSearch,
    refetch,
  };
};
