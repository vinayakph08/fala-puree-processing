import { qualityCheckController } from "@/app/(protected)/quality-check/db-controller";
import { getUserFromServerSide } from "@/lib/auth/get-user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { user, error: authError } = await getUserFromServerSide();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await qualityCheckController.getQualityTests({
      user_id: user.id,
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
