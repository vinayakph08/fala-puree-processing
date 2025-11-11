import { NextRequest, NextResponse } from "next/server";
import { dashboardController } from "@/app/(protected)/dashboard/db-controller";

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await dashboardController.getInventoryUsageData();

    if (error) {
      console.error("Error fetching inventory usage data:", error);
      return NextResponse.json(
        { error: "Failed to fetch inventory usage data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("API Error fetching inventory usage data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
