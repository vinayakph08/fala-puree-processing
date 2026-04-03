import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { qualityCheckController } from "@/app/(protected)/(main-pages)/quality-check/db-controller";


export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();

    const { id } = await context.params;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageUrl, originalFilename, imageSizeBytes } = await request.json();

    const imageData = {
      batch_id: id,
      image_url: imageUrl,
      original_filename: originalFilename,
      image_size_bytes: imageSizeBytes,
    };

    // TODO : createImageRecord should create an Entr
    const { data, error } = await qualityCheckController.createPureeImageRecord({
      data: imageData,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    console.error("Error uploading inventory image:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
