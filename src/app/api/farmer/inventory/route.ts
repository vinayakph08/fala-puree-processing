import { farmerInventoryController } from "@/app/(protected)/farmers/db-controller";
import { NextRequest, NextResponse } from "next/server";

// get Farmer Inventory by farmerId
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get("farmerId");

    if (!farmerId) {
      return NextResponse.json(
        { error: "Missing farmerId parameter" },
        { status: 400 }
      );
    }

    const { inventory, error } =
      await farmerInventoryController.getInventoryByFarmerId(farmerId);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data: inventory }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 }
      );
    }

    const { data, error } = await farmerInventoryController.deleteInventoryItem(
      { id }
    );

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
