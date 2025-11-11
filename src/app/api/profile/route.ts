import { profileController } from "@/app/(protected)/profile/db-controller";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user profile from database
    const { profile, error: profileError } =
      await profileController.getUserProfile({
        userId: user.id,
      });

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      firstName,
      lastName,
      firstNameKn,
      lastNameKn,
      firstNameEn,
      lastNameEn,
      primaryNameLanguage,
      languagePreference,
    } = body;

    // Update user profile in database
    const { data: updatedProfile, error: updateError } = await supabase
      .from("user_profile")
      .update({
        title,
        first_name: firstName,
        last_name: lastName,
        first_name_kn: firstNameKn,
        last_name_kn: lastNameKn,
        first_name_en: firstNameEn,
        last_name_en: lastNameEn,
        primary_name_language: primaryNameLanguage,
        language_preference: languagePreference,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    // Transform response to match frontend interface
    const farmerProfile = {
      id: updatedProfile.id,
      firstName: updatedProfile.first_name || "",
      lastName: updatedProfile.last_name || "",
      firstNameKn: updatedProfile.first_name_kn || undefined,
      lastNameKn: updatedProfile.last_name_kn || undefined,
      firstNameEn: updatedProfile.first_name_en || undefined,
      lastNameEn: updatedProfile.last_name_en || undefined,
      primaryNameLanguage: updatedProfile.primary_name_language || "kn",
      title: updatedProfile.title || "sri",
      language: updatedProfile.language_preference || "kn",
    };

    return NextResponse.json({ profile: farmerProfile });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
