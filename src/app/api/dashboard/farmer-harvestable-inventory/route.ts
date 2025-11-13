import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cropFilter = searchParams.get("crop") || undefined;

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error("API Error fetching farmer harvestable inventory:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
