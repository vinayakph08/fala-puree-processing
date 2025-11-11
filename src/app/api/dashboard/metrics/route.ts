import { NextRequest, NextResponse } from "next/server";
import { dashboardController } from "@/app/(protected)/dashboard/db-controller";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cropFilter = searchParams.get("crop") || undefined;

    const { metrics, error } = await dashboardController.getDashboardMetrics(
      cropFilter
    );

    if (error) {
      console.error("Error fetching dashboard metrics:", error);
      return NextResponse.json(
        { error: "Failed to fetch dashboard metrics" },
        { status: 500 }
      );
    }

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error("API Error fetching dashboard metrics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
