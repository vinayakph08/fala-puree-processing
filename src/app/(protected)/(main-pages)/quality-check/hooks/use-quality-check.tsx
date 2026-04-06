"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QC_KEYS } from "../utils/query-keys";
import {
  apiSearchQualityTests,
  apiDeleteQualityTest,
  type SearchQualityTestsParams,
} from "../utils/query-functions";

export function useQualityCheck() {
  const queryClient = useQueryClient();

  const [searchParams, setSearchParams] = useState<SearchQualityTestsParams>({
    search: "",
    status: undefined,
    page: 0,
    limit: 20,
  });

  const {
    data: paginatedTests,
    isLoading,
    error,
  } = useQuery({
    queryKey: QC_KEYS.search(searchParams),
    queryFn: () => apiSearchQualityTests(searchParams),
    staleTime: 1000 * 60 * 1,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const deleteTestMutation = useMutation({
    mutationFn: apiDeleteQualityTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QC_KEYS.all });
      toast.success("Quality test deleted.");
    },
    onError: () => {
      toast.error("Failed to delete quality test.");
    },
  });

  return {
    tests: paginatedTests?.tests ?? [],
    pagination: paginatedTests?.pagination ?? null,
    isLoading,
    error,
    searchParams,
    setSearchParams,
    deleteTest: (id: string) => deleteTestMutation.mutateAsync(id),
    isDeleting: deleteTestMutation.isPending,
  };
}
