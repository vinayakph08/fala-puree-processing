"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Settings, LogOut } from "lucide-react";
import { useFarmer } from "@/providers/farmer-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/lib/auth";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useLocaleContext } from "@/providers/locale-provider";

export const ProfileDropdown: React.FC = () => {
  const t = useTranslations();
  const { currentLocale } = useLocaleContext();
  const { getDisplayName, getInitials, farmer } = useFarmer();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Call Supabase auth logout
      const { error } = await signOut();

      if (error) {
        console.error("Logout error:", error);
        toast.error(t("profile.messages.logoutError"));
        return;
      }

      // Clear user data from localStorage
      localStorage.removeItem("farmerId");
      localStorage.removeItem("farmerData");
      localStorage.removeItem("userPreferences");

      // Show success message
      toast.success(t("profile.messages.logoutSuccess"));

      // Add delay for better UX

      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(t("profile.messages.logoutError"));
    } finally {
      setIsLoggingOut(false);
    }
  };

  const displayName = getDisplayName(currentLocale);
  const initials: string =
    getInitials({
      firstName: farmer.firstName,
      lastName: farmer.lastName,
    }) || " "; // Assuming lastName is optional

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-10 px-2 py-1'>
          <Avatar className='h-8 w-8'>
            <AvatarFallback className='text-xs bg-primary text-primary-foreground'>
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className='hidden lg:inline text-sm'>{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <div className='px-2 py-1.5'>
          <p className='text-sm font-medium'>{displayName}</p>
          <p className='text-xs text-muted-foreground'>
            {t("profile.farmerAccount")}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <User className='mr-2 h-4 w-4' />
          {t("common.navigation.profile")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <Settings className='mr-2 h-4 w-4' />
          {t("common.navigation.settings")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className='text-red-600 focus:text-red-600 focus:bg-red-50'
        >
          <LogOut className='mr-2 h-4 w-4' />
          {isLoggingOut
            ? t("profile.buttons.loggingOut")
            : t("profile.buttons.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
