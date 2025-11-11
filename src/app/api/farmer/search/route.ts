import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Helper: build Supabase query for filters, search, and sorting
function buildUserSearchQuery(supabase: any, params: URLSearchParams) {
  let query = supabase.from("user_profile").select(
    `*,
       farm:farm (
    farm_id,
    farm_name,
	state,
	district,
	village
	)`,
    { count: "exact" } // Enable count for total records
  );

  // Search by first name or farm ID
  const search = params.get("search");

  if (search) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%`
    );
  }

  // Only farmers by default
  if (!params.get("role")) query = query.eq("role", "FARMER");

  return query;
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const params = req.nextUrl.searchParams;

    // Extract pagination parameters
    const page = Math.max(0, parseInt(params.get("page") || "0", 10));
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(params.get("pageSize") || "10", 10))
    );
    const from = page * pageSize;
    const to = from + pageSize - 1;

    // Build base query
    const baseQuery = buildUserSearchQuery(supabase, params);

    // Execute query with pagination
    const { data, error, count } = await baseQuery.range(from, to);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate pagination info
    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    const paginationInfo: PaginationInfo = {
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages - 1,
      hasPreviousPage: page > 0,
    };

    return NextResponse.json(
      { farmers: data, pagination: paginationInfo },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
