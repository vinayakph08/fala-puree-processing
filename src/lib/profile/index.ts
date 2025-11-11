import { profileController } from "@/app/(protected)/profile/db-controller";

export const getProfileData = async ({ userId }: { userId: string }) => {
  try {
    const { profile, error } = await profileController.getUserProfile({
      userId,
    });
    return { profile, error };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { profile: null, error };
  }
};
