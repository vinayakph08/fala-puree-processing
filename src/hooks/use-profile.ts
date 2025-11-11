import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FarmerProfile } from "@/providers/farmer-provider";

interface ProfileResponse {
  profile: FarmerProfile;
}

interface ProfileUpdateData {
  title?: "sri" | "srimati";
  firstName?: string;
  lastName?: string;
  firstNameKn?: string;
  lastNameKn?: string;
  firstNameEn?: string;
  lastNameEn?: string;
  primaryNameLanguage?: "kn" | "en";
  languagePreference?: "kn" | "en";
}

// Fetch user profile from server
const fetchProfile = async (): Promise<FarmerProfile> => {
  const response = await fetch("/api/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch profile: ${response.statusText}`);
  }

  const data: ProfileResponse = await response.json();
  return data.profile;
};

// Update user profile on server
const updateProfile = async (
  updateData: ProfileUpdateData
): Promise<FarmerProfile> => {
  const response = await fetch("/api/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update profile: ${response.statusText}`);
  }

  const data: ProfileResponse = await response.json();
  return data.profile;
};

export const useProfile = () => {
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 unauthorized errors
      if (error instanceof Error && error.message.includes("401")) {
        return false;
      }
      return failureCount < 3;
    },
    refetchOnWindowFocus: false,
    // Only run query if we expect to have auth
    enabled: true,
  });

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedProfile) => {
      // Update the cache with the new profile data
      queryClient.setQueryData(["profile"], updatedProfile);
    },
    onError: (error) => {
      console.error("Profile update failed:", error);
    },
  });

  const updateProfileData = (updateData: ProfileUpdateData) => {
    return updateMutation.mutateAsync(updateData);
  };

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile: updateProfileData,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
};
