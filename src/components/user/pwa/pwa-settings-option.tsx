"use client";

import { Download, Smartphone, CheckCircle, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePWA } from "@/providers/pwa-provider";

export function PWASettingsOption() {
  const t = useTranslations("common.pwa");
  const { installStatus, isIOS, showInstallPrompt, resetDismissedStatus } =
    usePWA();

  const handleInstallClick = async () => {
    if (installStatus === "dismissed") {
      // Reset the dismissed status first
      resetDismissedStatus();
    }

    if (isIOS) {
      // Show iOS instructions
      alert(t("ios.instructions"));
    } else {
      await showInstallPrompt();
    }
  };

  const getStatusBadge = () => {
    switch (installStatus) {
      case "installed":
        return (
          <Badge variant='secondary' className='bg-green-100 text-primary'>
            <CheckCircle className='h-3 w-3 mr-1' />
            {t("settings.status.installed")}
          </Badge>
        );
      case "available":
        return (
          <Badge variant='secondary' className='bg-blue-100 text-blue-700'>
            <Download className='h-3 w-3 mr-1' />
            {t("settings.status.available")}
          </Badge>
        );
      case "dismissed":
        return (
          <Badge variant='secondary' className='bg-orange-100 text-orange-700'>
            <Clock className='h-3 w-3 mr-1' />
            {t("settings.status.dismissed")}
          </Badge>
        );
      case "installing":
        return (
          <Badge variant='secondary' className='bg-yellow-100 text-yellow-700'>
            <Download className='h-3 w-3 mr-1' />
            {t("settings.status.installing")}
          </Badge>
        );
      default:
        return (
          <Badge variant='secondary' className='bg-gray-100 text-gray-700'>
            {t("settings.status.notAvailable")}
          </Badge>
        );
    }
  };

  const getButtonText = () => {
    switch (installStatus) {
      case "installed":
        return t("settings.button.installed");
      case "installing":
        return t("settings.button.installing");
      case "dismissed":
        return t("settings.button.enableInstall");
      case "available":
        return t("settings.button.install");
      default:
        return t("settings.button.notAvailable");
    }
  };

  const isButtonDisabled = () => {
    return (
      installStatus === "installed" ||
      installStatus === "installing" ||
      installStatus === "not-available"
    );
  };

  return (
    <Card className='w-full'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-primary/10 rounded-lg'>
              <Smartphone className='h-5 w-5 text-primary' />
            </div>
            <div>
              <CardTitle className='text-base'>{t("settings.title")}</CardTitle>
              <CardDescription className='text-sm'>
                {t("settings.description")}
              </CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Benefits list for farmers */}
        <div className='space-y-2'>
          <div className='flex items-center gap-3 text-sm text-gray-600'>
            <div className='w-2 h-2 bg-primary rounded-full flex-shrink-0'></div>
            <span>{t("features.quickAccess")}</span>
          </div>
          <div className='flex items-center gap-3 text-sm text-gray-600'>
            <div className='w-2 h-2 bg-primary rounded-full flex-shrink-0'></div>
            <span>{t("features.offline")}</span>
          </div>
          <div className='flex items-center gap-3 text-sm text-gray-600'>
            <div className='w-2 h-2 bg-primary rounded-full flex-shrink-0'></div>
            <span>{t("features.notifications")}</span>
          </div>
        </div>

        {/* Install/Enable button */}
        <div className='flex gap-2 pt-2'>
          <Button
            onClick={handleInstallClick}
            disabled={isButtonDisabled()}
            className='flex-1 bg-primary hover:bg-emerald-600 text-white min-h-[44px]'
            size='sm'
          >
            <Download className='h-4 w-4 mr-2' />
            {getButtonText()}
          </Button>
        </div>

        {/* Additional help text for dismissed state */}
        {installStatus === "dismissed" && (
          <div className='bg-orange-50 border border-orange-200 rounded-lg p-3'>
            <p className='text-sm text-orange-800'>
              {t("settings.help.dismissed")}
            </p>
          </div>
        )}

        {/* iOS specific instructions */}
        {isIOS && installStatus !== "installed" && (
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
            <p className='text-sm text-blue-800'>{t("settings.help.ios")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
