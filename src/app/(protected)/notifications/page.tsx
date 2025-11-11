"use client";

import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NotificationsPage() {
  const t = useTranslations("common");

  return (
    <div className='container mx-auto px-4 py-6'>
      <div className='flex items-center gap-3 mb-6'>
        <Bell className='w-6 h-6 text-primary' />
        <h1 className='text-2xl font-bold'>{t("navigation.notifications")}</h1>
      </div>

      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <Bell className='w-16 h-16 text-muted-foreground mb-4' />
        <h2 className='text-lg font-medium text-muted-foreground mb-2'>
          {t("messages.noNotifications")}
        </h2>
        <p className='text-sm text-muted-foreground max-w-sm'>
          {t("messages.notificationsDescription")}
        </p>
      </div>
    </div>
  );
}
