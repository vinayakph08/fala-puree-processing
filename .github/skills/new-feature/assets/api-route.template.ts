// @ts-nocheck
// src/app/api/[feature]/route.ts
// Replace [feature] and import paths with your feature name

import { getUserFromServerSide } from "@/lib/auth/get-user";
import { featureController } from "@/app/(protected)/(main-pages)/[feature]/db-controller";
import { NextRequest, NextResponse } from "next/server";

// ─── GET — Fetch all items for the authenticated user ───────────────────────

export const GET = async (request: NextRequest) => {
  try {
    const { user, error: authError } = await getUserFromServerSide();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // UNWRAP: DbResult<T> → T
    const { data, error } = await featureController.getItems({ farmer_id: user.id });

    if (error) {
      console.error("[GET /api/feature]", error);
      return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }

    // WRAP: T → { data: T } (HTTP response envelope — query-functions unwrap this)
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/feature] Unexpected:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

// ─── POST — Create a new item ─────────────────────────────────────────────────

export const POST = async (request: NextRequest) => {
  try {
    const { user, error: authError } = await getUserFromServerSide();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { data, error } = await featureController.createItem({ data: { ...body, farmer_id: user.id } });

    if (error) {
      console.error("[POST /api/feature]", error);
      return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/feature] Unexpected:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

// ─── PUT — Update an existing item ───────────────────────────────────────────

export const PUT = async (request: NextRequest) => {
  try {
    const { user, error: authError } = await getUserFromServerSide();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { data, error } = await featureController.updateItem({ id, data: body });

    if (error) {
      console.error("[PUT /api/feature]", error);
      return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("[PUT /api/feature] Unexpected:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

// ─── DELETE — Soft delete an item ────────────────────────────────────────────

export const DELETE = async (request: NextRequest) => {
  try {
    const { user, error: authError } = await getUserFromServerSide();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { data, error } = await featureController.deleteItem({ id });

    if (error) {
      console.error("[DELETE /api/feature]", error);
      return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/feature] Unexpected:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

// ─── Need search / filtering / pagination? ──────────────────────────────────
// Use the separate template: assets/api-route-search.template.ts
// File location: src/app/api/[feature]/search/route.ts

// STOP — do not add search code to this file.
// The search route is a separate Next.js route file.
// See api-route-search.template.ts for the full implementation.

/*
export const GET = async (request: NextRequest) => {
  try {
    const { user, error: authError } = await getUserFromServerSide();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const filters = {
      farmer_id: user.id,
      q:          searchParams.get("q") ?? undefined,
      status:     searchParams.get("status") ?? undefined,
      sort_by:    searchParams.get("sort_by") ?? "created_at",
      sort_order: (searchParams.get("sort_order") ?? "desc") as "asc" | "desc",
      page:       parseInt(searchParams.get("page") ?? "1"),
      page_size:  parseInt(searchParams.get("page_size") ?? "20"),
    };

    const { data, error } = await featureController.searchItems(filters);

    if (error) {
      console.error("[GET /api/feature/search]", error);
      return NextResponse.json({ error: "Failed to search" }, { status: 500 });
    }

    return NextResponse.json({ data, page: filters.page, page_size: filters.page_size }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/feature/search] Unexpected:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
*/

// ─── Corresponding DB controller method for search ────────────────────────────
/*
async searchItems({ farmer_id, q, status, sort_by, sort_order, page, page_size }) {
  const supabase = await createClient();
  try {
    let query = supabase
      .from("feature_table")
      .select("*", { count: "exact" })
      .eq("farmer_id", farmer_id)
      .eq("is_deleted", false);

    if (q)      query = query.ilike("name", `%${q}%`);
    if (status) query = query.eq("status", status);

    query = query
      .order(sort_by, { ascending: sort_order === "asc" })
      .range((page - 1) * page_size, page * page_size - 1);

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);
    return { data: { items: data, total: count }, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
*/
