import { farmersController } from "@/app/(protected)/farmers/db-controller";
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
    const { farmers, error: farmersError } =
      await farmersController.getAllFarmers();

    if (farmersError) {
      console.error("Farmers fetch error:", farmersError);
      return NextResponse.json(
        { error: "Failed to fetch farmers" },
        { status: 500 }
      );
    }

    if (!farmers) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ farmers }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
