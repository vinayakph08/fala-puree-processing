import { qualityCheckController } from "@/app/(protected)/(main-pages)/quality-check/db-controller";
import { getUserFromServerSide } from "@/lib/auth/get-user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await getUserFromServerSide();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const page = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 0;
    const limit = searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : 20;

    const { data, error } = await qualityCheckController.searchQualityTests({
      search_term: search ?? null,
      status: status ?? null,
      page,
      limit,
    });
    if (error) {
      console.error("[GET /api/quality-check]", error);
      return NextResponse.json(
        { error: "Failed to fetch quality tests" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/quality-check]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
