import { createClient } from "@/utils/supabase/server";

class ProfileDBController {
  // Methods for handling profile database operations would go here
  constructor() {
    // Initialization code
  }

  async getUserProfile({ userId }: { userId: string }) {
    // Logic to retrieve user profile from the database
    const supabase = await createClient();

    try {
      if (!userId) throw new Error("User ID is required");

      // Fetch user profile from database
      const { data: profile, error: profileError } = await supabase
        .from("user_profile")
        .select(
          `*, 
          farm:farm (
          farm_id,
          farm_name,
          created_at,
          updated_at
        )
          `
        )
        .eq("id", userId)
        .single();

      const farmerProfile = {
        id: profile.id,
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        firstNameKn: profile.first_name_kn || undefined,
        lastNameKn: profile.last_name_kn || undefined,
        firstNameEn: profile.first_name_en || undefined,
        lastNameEn: profile.last_name_en || undefined,
        primaryNameLanguage: profile.primary_name_language || "kn",
        title: profile.title || "sri",
        language: profile.language_preference || "kn",
        mobileNumber: profile.mobile_number,
        email: profile.email,
        isVerified: profile.is_verified,
        isActive: profile.is_active,
        role: profile.role,
        farm: profile.farm
          ? {
              farm_id: profile.farm?.[0]?.farm_id,
              farmName: profile.farm?.[0]?.farm_name,
              createdAt: profile.farm?.[0]?.created_at,
              updatedAt: profile.farm?.[0]?.updated_at,
            }
          : null,
      };

      if (profileError) throw profileError;
      return { profile: farmerProfile, error: null };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return { profile: null, error };
    }
  }

  async updateUserProfile({
    userId,
    profileData,
  }: {
    userId: string;
    profileData: any;
  }) {
    // Logic to update user profile in the database
  }

  deleteUserProfile(userId: string) {
    // Logic to delete user profile from the database
  }
}

export const profileController = new ProfileDBController();
