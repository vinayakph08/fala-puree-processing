import { inventoryController } from "@/app/(protected)/inventory/db-controller";
import { getUserFromServerSide } from "@/lib/auth/get-user";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { user, error: authError } = await getUserFromServerSide();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // get query param id
    const { searchParams } = new URL(request.url);
    const inventoryId = searchParams.get("id");

    if (!inventoryId) {
      return NextResponse.json(
        { error: "Missing inventory ID in query parameters" },
        { status: 400 }
      );
    }

    const { data, error } = await inventoryController.getAllInventoryById(
      inventoryId
    );

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
