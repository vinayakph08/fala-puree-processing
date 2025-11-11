"use client";

import { X, Download, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { usePWA } from "@/providers/pwa-provider";

export function PWAInstallBanner() {
  const t = useTranslations("common.pwa");
  const { installStatus, isIOS, showInstallPrompt, dismissInstallPrompt } =
    usePWA();

  // Don't show banner if not available or already dismissed/installed
  if (installStatus !== "available" && installStatus !== "installing") {
    return null;
  }

  const handleInstall = async () => {
    if (isIOS) {
      // For iOS, we'll show instructions in a modal
      // For now, just show alert - we can enhance this later
      alert(t("ios.instructions"));
    } else {
      await showInstallPrompt();
    }
  };

  return (
    <div className='bg-gradient-to-r from-primary/90 to-primary text-white p-4 m-4 rounded-lg shadow-lg'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-3 flex-1 min-w-0'>
          <div className='flex-shrink-0'>
            <Smartphone className='h-6 w-6' />
          </div>

          <div className='flex-1 min-w-0'>
            <h3 className='font-semibold text-sm leading-tight'>
              {t("banner.title")}
            </h3>
            {/* <p className='text-xs text-green-100 mt-1 leading-tight'>
              {t("banner.description")}
            </p> */}
          </div>
        </div>

        <div className='flex items-center gap-2 flex-shrink-0'>
          <Button
            onClick={handleInstall}
            size='sm'
            variant='secondary'
            className='bg-white text-primary hover:bg-gray-100 min-h-[42px] min-w-[108px] text-sm font-medium hover:cursor-pointer'
            disabled={installStatus === "installing"}
          >
            <Download className='h-4 w-4 mr-1' />
            {installStatus === "installing" ? "installing" : "install"}
          </Button>

          <Button
            onClick={dismissInstallPrompt}
            size='sm'
            variant='ghost'
            className='text-white hover:bg-white/30 p-2 min-h-[42px] min-w-[42px]'
          >
            <X className='h-5 w-5' />
            <span className='sr-only'>{t("banner.dismiss")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
