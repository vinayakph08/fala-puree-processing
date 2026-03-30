import { usersController } from "@/app/(protected)/users/db-controller";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const { id } = await context.params;
  try {
    const { user, error } = await usersController.getUserById(id);
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
