import { qualityCheckController } from "@/app/(protected)/(main-pages)/quality-check/db-controller";
import { createQualityTestSchema } from "@/app/(protected)/(main-pages)/quality-check/utils";
import { getUserFromServerSide } from "@/lib/auth/get-user";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user, error: authError } = await getUserFromServerSide();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { data, error } = await qualityCheckController.getQualityTestById(id);

    if (error) {
      console.error("[GET /api/quality-check/[id]]", error);
      return NextResponse.json(
        { error: "Failed to fetch quality test" },
        { status: 500 },
      );
    }
    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/quality-check/[id]]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user, error: authError } = await getUserFromServerSide();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const validated = createQualityTestSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }

    const status: "draft" | "pending" | "passed" | "failed" =
      body.status ?? "draft";

    const { data, error } = await qualityCheckController.updateQualityTest(id, {
      ...validated.data,
      production_line: validated.data.production_line ?? null,
      color_l: validated.data.color_l ?? null,
      color_a: validated.data.color_a ?? null,
      color_b: validated.data.color_b ?? null,
      color_image_url: validated.data.color_image_url ?? null,
      texture_brix: validated.data.texture_brix ?? null,
      viscosity_cp: validated.data.viscosity_cp ?? null,
      taste_flavour_score: validated.data.taste_flavour_score ?? null,
      cooking_color_score: validated.data.cooking_color_score ?? null,
      cooking_color_image_url: validated.data.cooking_color_image_url ?? null,
      cooking_taste_score: validated.data.cooking_taste_score ?? null,
      cooking_notes: validated.data.cooking_notes ?? null,
      status,
    });

    if (error) {
      console.error("[PATCH /api/quality-check/[id]]", error);
      return NextResponse.json(
        { error: "Failed to update quality test" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("[PATCH /api/quality-check/[id]]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user, error: authError } = await getUserFromServerSide();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin-only: check role
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("user_profile")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const { error } = await qualityCheckController.deleteQualityTest(id);

    if (error) {
      console.error("[DELETE /api/quality-check/[id]]", error);
      return NextResponse.json(
        { error: "Failed to delete quality test" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: null }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/quality-check/[id]]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
