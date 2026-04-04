import { createClient } from "@/utils/supabase/client";

/**
 * Upload single image to Supabase Storage
 */
export const uploadImageToStorage = async (
  file: File,
  testId: string,
  batchId: string,
  onProgress?: (progress: number) => void,
): Promise<{ publicUrl: string; error: string | null }> => {
  try {
    const supabase = createClient();

    const timestamp = Date.now();
    const path = `sp-${batchId}/qc-${testId}/image-${timestamp}.webp`;

    onProgress?.(10);

    // Upload file to storage
    const { data, error } = await supabase.storage
      .from("puree-qc-images")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true, // Allow overwriting
      });

    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    onProgress?.(80);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("puree-qc-images")
      .getPublicUrl(data.path);

    onProgress?.(100);

    return {
      publicUrl: urlData.publicUrl,
      error: null,
    };
  } catch (error) {
    console.error("Image upload error:", error);
    return {
      publicUrl: "",
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
};

// Remove the uploadBothImages function - no longer needed
