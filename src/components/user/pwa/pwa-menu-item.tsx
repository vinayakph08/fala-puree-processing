"use client";

import { Download, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePWA } from "@/providers/pwa-provider";

interface PWAMenuItemProps {
  onClick?: () => void;
}

export function PWAMenuItem({ onClick }: PWAMenuItemProps) {
  const t = useTranslations("common.pwa");
  const { installStatus, isIOS, showInstallPrompt, resetDismissedStatus } =
    usePWA();

  // Don't show if already installed
  if (installStatus === "installed") {
    return null;
  }

  const handleClick = async () => {
    if (installStatus === "dismissed") {
      resetDismissedStatus();
    }

    if (isIOS) {
      alert(t("ios.instructions"));
    } else {
      await showInstallPrompt();
    }

    onClick?.(); // Close menu if provided
  };

  return (
    <button
      onClick={handleClick}
      className='w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors min-h-[44px]'
      disabled={installStatus === "installing"}
    >
      <div className='p-2 bg-green-100 rounded-lg'>
        <Smartphone className='h-4 w-4 text-green-600' />
      </div>

      <div className='flex-1'>
        <div className='font-medium text-gray-900'>{t("menu.title")}</div>
        <div className='text-sm text-gray-600'>{t("menu.description")}</div>
      </div>

      <Download className='h-4 w-4 text-gray-400' />
    </button>
  );
}
