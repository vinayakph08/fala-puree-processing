import { NextRequest, NextResponse } from "next/server";
import { dashboardController } from "@/app/(protected)/dashboard/db-controller";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cropFilter = searchParams.get("crop") || undefined;

    const { data, error } = await dashboardController.getFarmerGrowthData(
      cropFilter
    );

    if (error) {
      console.error("Error fetching farmer growth data:", error);
      return NextResponse.json(
        { error: "Failed to fetch farmer growth data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("API Error fetching farmer growth data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
