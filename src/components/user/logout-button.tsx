"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth";
import { toast } from "sonner";

interface LogoutButtonProps {
  variant?: "default" | "outline" | "destructive" | "ghost";
  size?: "sm" | "default" | "lg";
  showIcon?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = "destructive",
  size = "default",
  showIcon = true,
  className = "",
  fullWidth = false,
}) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Call Supabase auth logout
      const { error } = await signOut();

      if (error) {
        console.error("Logout error:", error);
        toast.error("Logout failed. Please try again.");
        return;
      }

      // Clear user data from localStorage
      localStorage.removeItem("farmerId");
      localStorage.removeItem("farmerData");
      localStorage.removeItem("userPreferences");

      // Show success message
      toast.success("Logout successful.");

      // Add a small delay for better UX

      // Redirect to login
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={cn(
        "min-h-[44px] touch-manipulation text-white bg-pink-700 hover:bg-pink-600",
        fullWidth && "w-full",
        className
      )}
    >
      {showIcon && <LogOut className='h-4 w-4 mr-2' />}
      {isLoggingOut ? "Logging out..." : "Logout"}
    </Button>
  );
};
