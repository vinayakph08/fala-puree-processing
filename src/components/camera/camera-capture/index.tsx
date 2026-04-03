import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, RotateCcw, CheckCircle, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CameraCaptureProps {
  onCapture?: (file: File) => void;
  onCancel?: () => void;
  className?: string;
  resolution?: {
    width: number;
    height: number;
  };
  quality?: number;
  facingMode?: "user" | "environment";
  showTimestamp?: boolean;
  captureButtonText?: string;
}

export const CameraCapture = ({
  onCapture,
  onCancel,
  className,
  resolution = { width: 1280, height: 720 },
  quality = 0.8,
  facingMode = "environment",
  showTimestamp = false,
  captureButtonText = "Capture Photo",
}: CameraCaptureProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // Separate effect for camera initialization when video element is ready
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Step 1: Get camera stream first
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: resolution.width },
            height: { ideal: resolution.height },
          },
        });

        // Step 2: Set stream state
        setStream(mediaStream);

        // Step 3: Wait for video element to be available, then set source
        if (videoRef.current) {
          const video = videoRef.current;
          video.srcObject = mediaStream;

          // Step 4: Wait for video to load before playing
          const handleCanPlay = () => {
            video
              .play()
              .then(() => {
                setIsLoading(false);
              })
              .catch((error) => {
                console.error("Video play failed:", error);
                setIsLoading(false);
              });
            video.removeEventListener("canplay", handleCanPlay);
          };

          video.addEventListener("canplay", handleCanPlay);

          // Fallback timeout in case canplay doesn't fire
          setTimeout(() => {
            if (isLoading) {
              setIsLoading(false);
            }
          }, 3000);
        }
      } catch (err) {
        console.error("Camera initialization failed:", err);
        setError("Camera access failed. Please check permissions.");
        setIsLoading(false);
        toast.error("Camera Access Failed", {
          description: "Unable to access camera. Please check permissions.",
        });
      }
    };

    // Small delay to ensure React has rendered the video element
    const timer = setTimeout(() => {
      initializeCamera();
    }, 100);

    return () => clearTimeout(timer);
  }, []); // Only run once when component mounts

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !stream) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Add timestamp if enabled
    if (showTimestamp) {
      addTimestamp(context, canvas);
    }

    // Convert to blob and create file
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const now = new Date();
          const dateStr =
            now.getFullYear() +
            String(now.getMonth() + 1).padStart(2, "0") +
            String(now.getDate()).padStart(2, "0") +
            "-" +
            String(now.getHours()).padStart(2, "0") +
            String(now.getMinutes()).padStart(2, "0") +
            String(now.getSeconds()).padStart(2, "0");

          const file = new File([blob], `crop-${dateStr}.jpg`, {
            type: "image/jpeg",
          });

          // Show preview
          const reader = new FileReader();
          reader.onload = (e) => {
            setCapturedImage(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      },
      "image/jpeg",
      quality,
    );
  };

  const addTimestamp = (
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
  ) => {
    const now = new Date();
    const timestamp = now.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    const fontSize = Math.max(16, canvas.width * 0.03);
    context.font = `bold ${fontSize}px Arial`;
    context.textAlign = "right";
    context.textBaseline = "bottom";

    // Background for text
    const textMetrics = context.measureText(timestamp);
    const textWidth = textMetrics.width;
    const textHeight = fontSize;
    const padding = 8;

    context.fillStyle = "rgba(0, 0, 0, 0.6)";
    context.fillRect(
      canvas.width - textWidth - padding * 4,
      canvas.height - textHeight - padding * 4,
      textWidth + padding * 4,
      textHeight + padding * 4,
    );

    // Text
    context.fillStyle = "#ffffff";
    context.fillText(
      timestamp,
      canvas.width - padding,
      canvas.height - padding,
    );
  };

  const confirmCapture = () => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob(
      (blob) => {
        if (blob) {
          const now = new Date();
          const dateStr =
            String(now.getDate()).padStart(2, "0") +
            String(now.getMonth() + 1).padStart(2, "0") +
            now.getFullYear() +
            "-" +
            String(now.getHours()).padStart(2, "0") +
            String(now.getMinutes()).padStart(2, "0") +
            String(now.getSeconds()).padStart(2, "0");

          const file = new File([blob], `crop-${dateStr}.jpg`, {
            type: "image/jpeg",
          });
          onCapture?.(file);
        }
      },
      "image/jpeg",
      quality,
    );
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    // Clear video element source to prevent play() conflicts
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }
  };

  const handleCancel = () => {
    cleanup();
    onCancel?.();
  };

  if (error) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black flex items-center justify-center",
          className,
        )}
      >
        <div className='text-center p-6'>
          <Camera className='h-16 w-16 mx-auto mb-4 text-red-400' />
          <h3 className='text-white text-lg font-semibold mb-2'>
            Camera Error
          </h3>
          <p className='text-gray-300 mb-4'>{error}</p>
          <Button onClick={handleCancel} variant='outline'>
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-black flex flex-col">
      {/* Camera View */}
      <div className='flex-1 relative'>
        {/* Video Stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn(
            "w-full h-full object-cover",
            isLoading && "opacity-0",
            capturedImage && "hidden",
          )}
        />

        {/* Captured Image Preview */}
        {capturedImage && (
          <img
            src={capturedImage}
            alt='Captured preview'
            className='w-full h-full object-cover'
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-black'>
            <div className='text-white text-center'>
              <Camera className='h-16 w-16 mx-auto mb-4 animate-pulse' />
              <p>Starting camera...</p>
            </div>
          </div>
        )}

        {/* Grid Overlay */}
        {!capturedImage && !isLoading && (
          <div className='absolute inset-0 pointer-events-none'>
            <div className='w-full h-full grid grid-cols-3 grid-rows-3 opacity-30'>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className='border border-white/20' />
              ))}
            </div>
          </div>
        )}

        {/* Top Controls */}
        <div className='absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent'>
          <div className='flex justify-between items-center'>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleCancel}
              className='text-white hover:bg-white/20'
            >
              <X className='h-6 w-6' />
            </Button>

            {!capturedImage && (
              <div className='text-white text-sm font-medium'>
                Align crop within the frame
              </div>
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className='absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent'>
          <div className='flex items-center justify-center gap-4'>
            {capturedImage ? (
              // Preview Actions
              <>
                <Button
                  size='lg'
                  variant='outline'
                  onClick={retakePhoto}
                  className='w-12 h-12 rounded-full border-2 border-white/30 bg-red-400 text-white hover:bg-red-500 hover:text-white'
                >
                  <RotateCcw className='h-8 w-8' />
                </Button>

                <Button
                  size='lg'
                  onClick={confirmCapture}
                  className='w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white border-4 border-white/30'
                >
                  <Check className='h-8 w-8' />
                </Button>
              </>
            ) : (
              // Capture Button
              <Button
                size='lg'
                onClick={capturePhoto}
                disabled={isLoading}
                className='w-16 h-16 rounded-full bg-white hover:bg-gray-100 text-black border-4 border-white/30 disabled:opacity-50'
              >
                <Camera className='h-6 w-6' />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className='hidden' />
    </div>
  );
};
