"use client";

import { apiGetQualityTestById } from "@/app/(protected)/(main-pages)/quality-check/utils/query-functions";
import { QC_KEYS } from "@/app/(protected)/(main-pages)/quality-check/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useQualityCheckDetail(id: string) {
  const {
    data: test,
    isLoading,
    error,
  } = useQuery({
    queryKey: QC_KEYS.detail(id),
    queryFn: () => apiGetQualityTestById(id),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
  });

  return { test, isLoading, error };
}
