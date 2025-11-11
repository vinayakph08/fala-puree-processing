import { NextRequest, NextResponse } from "next/server";
import { dashboardController } from "@/app/(protected)/dashboard/db-controller";

export async function GET(request: NextRequest) {
  try {
    const { dashboardData, error } =
      await dashboardController.getAllDashboardData();

    if (error) {
      console.error("Error fetching all dashboard data:", error);
      return NextResponse.json(
        { error: "Failed to fetch dashboard data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ dashboardData });
  } catch (error) {
    console.error("API Error fetching all dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
