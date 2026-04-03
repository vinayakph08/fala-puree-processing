"use client";

import { useQuery } from "@tanstack/react-query";
import { QC_KEYS } from "../utils/query-keys";
import { apiGetQualityTests } from "../utils/query-functions";

export function useQualityCheck() {
  const {
    data: tests,
    isLoading,
    error,
  } = useQuery({
    queryKey: QC_KEYS.all,
    queryFn: apiGetQualityTests,
    staleTime: 1000 * 60 * 1,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  return { tests, isLoading, error };
}
