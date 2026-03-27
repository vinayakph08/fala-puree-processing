// @ts-nocheck
// src/app/api/[feature]/search/route.ts
// Only create this file if the feature needs text search, filtering, or pagination.
// Called as: GET /api/[feature]/search?q=text&status=active&sort_by=created_at&sort_order=desc&page=1&page_size=20

import { getUserFromServerSide } from "@/lib/auth/get-user";
import { featureController } from "@/app/(protected)/(main-pages)/[feature]/db-controller";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { user, error: authError } = await getUserFromServerSide();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const filters = {
      farmer_id:  user.id,
      q:          searchParams.get("q") ?? undefined,
      status:     searchParams.get("status") ?? undefined,
      sort_by:    searchParams.get("sort_by") ?? "created_at",
      sort_order: (searchParams.get("sort_order") ?? "desc") as "asc" | "desc",
      page:       parseInt(searchParams.get("page") ?? "1"),
      page_size:  parseInt(searchParams.get("page_size") ?? "20"),
    };

    // UNWRAP: DbResult<T> → T
    const { data, error } = await featureController.searchItems(filters);

    if (error) {
      console.error("[GET /api/feature/search]", error);
      return NextResponse.json({ error: "Failed to search" }, { status: 500 });
    }

    // WRAP: T → { data, page, page_size } (HTTP envelope — query-functions unwrap this)
    return NextResponse.json(
      { data, page: filters.page, page_size: filters.page_size },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/feature/search] Unexpected:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

// ─── Required DB Controller method ───────────────────────────────────────────
// Add this method to [feature]/db-controller/index.ts:
//
// async searchItems({ farmer_id, q, status, sort_by, sort_order, page, page_size }): Promise<DbResult<IFeatureItem[]>> {
//   const supabase = await createClient();
//   try {
//     let query = supabase
//       .from("feature_table")
//       .select("*", { count: "exact" })
//       .eq("farmer_id", farmer_id)
//       .eq("is_deleted", false);
//
//     if (q)      query = query.ilike("name", `%${q}%`);
//     if (status) query = query.eq("status", status);
//
//     query = query
//       .order(sort_by, { ascending: sort_order === "asc" })
//       .range((page - 1) * page_size, page * page_size - 1);
//
//     const { data, error, count } = await query;
//     if (error) throw new Error(error.message);
//     return { data, error: null };
//   } catch (error: any) {
//     return { data: null, error: error.message };
//   }
// }
