import { inventoryController } from "@/app/(protected)/inventory/db-controller";
import { getUserFromServerSide } from "@/lib/auth/get-user";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { user, error: authError } = await getUserFromServerSide();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { data, error } = await inventoryController.getAllInventoryItems();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  const supabase = await createClient();
  // Get the current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const inventoryId = request.nextUrl.searchParams.get("id");

  if (!inventoryId) {
    return NextResponse.json(
      { error: "Inventory ID is required" },
      { status: 400 }
    );
  }

  const { data, error } = await inventoryController.deleteInventoryItem({
    id: inventoryId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
};
