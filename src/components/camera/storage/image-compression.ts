/**
 * Image compression utilities for crop images
 * Optimized for mobile devices with fallback support
 */

export const IMAGE_SPECS = {
  webp: {
    quality: 1.0, // Max quality for WebP
    format: "webp" as const,
  },
} as const;

export interface UploadProgress {
  status: "idle" | "converting" | "uploading" | "completed" | "failed";
  progress: number; // 0-100
  size?: string; // "85KB"
}

/**
 * Process image to WebP with fallback to original file
 */
export const processImageToWebP = async (
  file: File,
  onProgress: (progress: number) => void,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    try {
      // If already WebP, return as-is
      if (file.type === "image/webp") {
        onProgress(100);
        resolve(file);
        return;
      }

      onProgress(10); // Start conversion

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      if (!ctx) {
        throw new Error("Canvas context not available");
      }

      img.onload = () => {
        try {
          onProgress(30); // Image loaded

          // Use original dimensions
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw image as-is
          ctx.drawImage(img, 0, 0);
          onProgress(70); // Drawing complete

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const webpFile = new File(
                  [blob],
                  `${file.name.split(".")[0]}.webp`,
                  {
                    type: "image/webp",
                    lastModified: Date.now(),
                  },
                );
                onProgress(100); // Conversion complete
                resolve(webpFile);
              } else {
                throw new Error("Canvas to blob conversion failed");
              }
            },
            "image/webp",
            IMAGE_SPECS.webp.quality,
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error("Image loading failed"));
      };

      onProgress(5); // Start loading
      img.src = URL.createObjectURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};


