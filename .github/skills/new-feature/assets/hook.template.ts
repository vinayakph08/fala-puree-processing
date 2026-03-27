// @ts-nocheck
// src/app/(protected)/(main-pages)/[feature]/hooks/use-[feature].tsx
// Replace [feature] and [Feature] throughout

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { apiGetFeatureList, apiDeleteFeature, apiUpdateFeature } from "../utils/query-functions"; // import any additional query functions you create
import { IFeatureItem } from "@/types/feature";
import {FEATURE_KEYS} from "./query-keys.ts"; // adjust path as needed




// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useFeature = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("feature");

  // ─── Query ──────────────────────────────────────────────────────────────────

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: FEATURE_KEYS.all,
    queryFn: apiGetFeatureList,
    staleTime: 1000 * 60 * 5, // 5 min — adjust per staleTime convention
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // ─── Delete Mutation ────────────────────────────────────────────────────────

  const deleteMutation = useMutation({
    mutationFn: apiDeleteFeature,
    onSuccess: () => {
      toast.success(t("success.delete"));
      queryClient.invalidateQueries(FEATURE_KEYS.all);
    },
    onError: (error) => {
      console.error("[apiDeleteFeature mutation]", error);
      toast.error(t("errors.deleteFailed"));
    },
  });

  // ─── Update Mutation (example for additional mutation) ─────────────────────
  const updateMutation = useMutation({
    mutationFn: apiUpdateFeature,
    onSuccess: () => {
      toast.success(t("success.update"));
      queryClient.invalidateQueries(FEATURE_KEYS.all);
    },
    onError: (error) => {
      console.error("[apiUpdateFeature mutation]", error);
      toast.error(t("errors.updateFailed"));
    },
  });  

  // ─── Return ─────────────────────────────────────────────────────────────────

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    deleteFeature: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    updateFeature: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};
