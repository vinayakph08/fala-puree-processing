import { createClient } from "@/utils/supabase/client";
import type { UserSignUpData, SignUpResponse, UserProfile } from "@/types/auth";
import { toast } from "sonner";

export const signInWithMobile = async (
  mobileNumber: string,
  password: string
) => {
  // Convert mobile number to email format for Supabase auth
  const email = `${mobileNumber}@fala.com`;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export const signUpWithMobile = async (
  signUpData: UserSignUpData
): Promise<SignUpResponse> => {
  try {
    // Convert mobile number to email format for Supabase auth if email not provided
    const email = signUpData.email || `${signUpData.phone_number}@fala.com`;
    const supabase = await createClient();

    const { data: generated_farm_id, error: farmIdError } = await supabase.rpc(
      "generate_farm_id",
      {
        p_farm_prefix: signUpData.farm_id,
      }
    );

    if (farmIdError) {
      console.error("Error generating farm_id:", farmIdError);
      toast.error("Error generating farm ID. Please try again.");
      throw new Error(farmIdError.message);
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: signUpData.password,
      options: {
        data: {
          phone_number: signUpData.phone_number,
          first_name: signUpData.first_name,
          last_name: signUpData.last_name,
          state: signUpData.state,
          district: signUpData.district,
          village: signUpData.village,
          farm_id: generated_farm_id || null,
          language_preference: signUpData.language_preference || "kn",
          role: signUpData.role || "FARMER",
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.name,
        },
      };
    }

    // The trigger will automatically create the user_profile record
    // If it fails, the signup will be rolled back
    return {
      success: true,
      user: data.user,
    };
  } catch (err) {
    return {
      success: false,
      error: {
        message:
          err instanceof Error ? err.message : "An unexpected error occurred",
      },
    };
  }
};

// Get user profile data
export const getUserProfile = async (): Promise<UserProfile | null> => {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return null;

  const { data: profile, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", user.user.id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return profile;
};

export const signOut = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Get the site URL.
export const getURL = () => {
  let url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  return url;
};
