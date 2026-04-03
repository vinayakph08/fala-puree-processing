import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
// import { useCacheInvalidation } from "../../earnings/hooks/use-cache-invalidation";

// Separate image upload function
export const uploadPureeImage = async ({
  file,
  batchId,
  userId,
  onProgress,
}: {
  file: File;
  batchId: string;
  userId: string;
  onProgress?: (progress: {
    status: string;
    progress: number;
    size?: string;
  }) => void;
}) => {
  try {
    // Import storage functions dynamically to avoid SSR issues
    const { processImageToWebP, uploadImageToStorage, formatFileSize } =
      await import("@/components/camera/storage");

    // Update progress for conversion
    onProgress?.({ status: "converting", progress: 0 });

    // Convert to WebP format
    const webpFile = await processImageToWebP(file, (progress) => {
      onProgress?.({
        status: progress === 100 ? "uploading" : "converting",
        progress,
      });
    });

    // Update progress with file size
    onProgress?.({
      status: "uploading",
      progress: 0,
      size: formatFileSize(webpFile.size),
    });

    // Upload to storage
    const uploadResult = await uploadImageToStorage(
      webpFile,
      userId,
      batchId,
      (progress) => {
        onProgress?.({
          status: progress === 100 ? "completed" : "uploading",
          progress,
          size: formatFileSize(webpFile.size),
        });
      },
    );

    if (uploadResult.error) {
      throw new Error(uploadResult.error);
    }

    // Save to database via API with rewards
    const response = await fetch(`/api/puree/${batchId}/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl: uploadResult.publicUrl,
        originalFilename: file.name,
        imageSizeBytes: webpFile.size,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save image to database");
    }

    onProgress?.({ status: "completed", progress: 100 });

    return response.json();
  } catch (error) {
    console.error("Error uploading puree image:", error);
    throw error;
  }
};

// Separate image delete function
export const deletePureeImage = async (imageId: string) => {
  try {
    const response = await fetch(`/api/puree/images/${imageId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete image");
    }
    return response.json();
  } catch (error) {
    console.error("Error deleting puree image:", error);
    throw error;
  }
};

// Hook for uploading and deleting puree images
export const usePureeImageUpload = () => {
  const queryClient = useQueryClient();
  // const { invalidateEarnings, invalidatePuree, invalidateRewards } =
  //   useCacheInvalidation();

  const uploadImageMutation = useMutation({
    mutationFn: uploadPureeImage,
    onSuccess: (data, variables) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({
        queryKey: ["puree-images-infinite", variables.batchId],
      });
      // invalidatePuree();
      // invalidateEarnings();
      // invalidateRewards();
      queryClient.invalidateQueries({
        queryKey: ["puree-item", variables.batchId],
      });
    },
    onError: (error) => {
      console.error("Error uploading puree image:", error);
      toast.error("Failed to upload puree image");
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: deletePureeImage,
    onSuccess: () => {
      // invalidatePuree();
      // invalidateEarnings();
      // invalidateRewards();
      queryClient.invalidateQueries({
        queryKey: ["puree-images-infinite"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["puree-item"],
        exact: false,
      });
      toast.success("Image deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    },
  });

  const uploadImage = (params: Parameters<typeof uploadPureeImage>[0]) => {
    return uploadImageMutation.mutateAsync(params);
  };

  const deleteImage = (imageId: string) => {
    return deleteImageMutation.mutateAsync(imageId);
  };

  return {
    uploadImage,
    deleteImage,
    isUploading: uploadImageMutation.isPending,
    isDeleting: deleteImageMutation.isPending,
    uploadError: uploadImageMutation.error,
    deleteError: deleteImageMutation.error,
    uploadImageMutation,
    deleteImageMutation,
  };
};
