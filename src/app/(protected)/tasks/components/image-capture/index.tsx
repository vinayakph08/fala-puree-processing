import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";

export const ImageCaptureAndUpload = () => {
  // Component logic here
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File too large. Please select an image smaller than 5MB");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      setStream(mediaStream);
      setIsCameraOpen(true);

      // Wait for next tick to ensure video element is rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(console.error);
        }
      }, 100);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Camera access failed!", {
        description:
          "Unable to access camera. Please check permissions or use file upload.",
      });
      // Fallback to file input
      fileInputRef.current?.click();
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the video frame
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Add timestamp overlay
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

        // Configure text styling
        const fontSize = Math.max(16, canvas.width * 0.03);
        context.font = `bold ${fontSize}px Arial`;
        context.textAlign = "right";
        context.textBaseline = "bottom";

        // Add semi-transparent background for text
        const textMetrics = context.measureText(timestamp);
        const textWidth = textMetrics.width;
        const textHeight = fontSize;
        const padding = 8;

        context.fillStyle = "rgba(0, 0, 0, 0.6)";
        context.fillRect(
          canvas.width - textWidth - padding * 2,
          canvas.height - textHeight - padding * 2,
          textWidth + padding * 2,
          textHeight + padding * 2
        );

        // Draw timestamp text
        context.fillStyle = "#ffffff";
        context.fillText(
          timestamp,
          canvas.width - padding,
          canvas.height - padding
        );

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], `crop-${Date.now()}.jpg`, {
                type: "image/jpeg",
              });
              setSelectedImage(file);

              const reader = new FileReader();
              reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
              };
              reader.readAsDataURL(file);

              closeCamera();
            }
          },
          "image/jpeg",
          0.8
        );
      }
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium'>Crop Photo</label>

      {isCameraOpen ? (
        <div className='fixed inset-0 z-50 bg-black flex flex-col'>
          <div className='flex-1 relative'>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className='w-full h-full object-cover'
            />

            {/* Top bar with close button */}
            <div className='absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent'>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={closeCamera}
                className='text-white hover:bg-white/20'
              >
                <X className='h-6 w-6' />
              </Button>
            </div>

            {/* Bottom controls */}
            <div className='absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent'>
              <div className='flex items-center justify-center'>
                <Button
                  type='button'
                  size='lg'
                  onClick={capturePhoto}
                  className='w-16 h-16 rounded-full bg-white hover:bg-gray-100 text-black border-4 border-white/30'
                >
                  <Camera className='h-8 w-8' />
                </Button>
              </div>
            </div>
          </div>
          <canvas ref={canvasRef} className='hidden' />
        </div>
      ) : imagePreview ? (
        <div className='relative'>
          <img
            src={imagePreview}
            alt='Crop preview'
            className='w-full h-32 object-cover rounded-lg border'
          />
          <Button
            type='button'
            variant='destructive'
            size='sm'
            className='absolute top-2 right-2'
            onClick={removeImage}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      ) : (
        <div className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-4'>
          <div className='text-center'>
            <Camera className='h-8 w-8 mx-auto mb-2 text-muted-foreground' />
            <p className='text-sm text-muted-foreground mb-2'>
              Upload crop photo
            </p>
            <div className='flex gap-2 justify-center'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={openCamera}
              >
                <Camera className='h-4 w-4 mr-2' />
                Open Camera
              </Button>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleImageSelect}
              className='hidden'
            />
          </div>
        </div>
      )}
    </div>
  );
};
