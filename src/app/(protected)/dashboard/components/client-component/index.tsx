"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFarmer } from "@/providers/farmer-provider";
import { useTranslations } from "next-intl";
import { useLocaleContext } from "@/providers/locale-provider";

function DashboardClientComponent() {
  const t = useTranslations("dashboard");
  const { currentLocale } = useLocaleContext();
  const { getWelcomeMessage } = useFarmer();
  const [selectedCrop, setSelectedCrop] = useState<string>("all");

  const cropFilter = selectedCrop === "all" ? undefined : selectedCrop;

  return (
    <div className='space-y-6'>
      {/* Desktop Header - only show on desktop since mobile has separate header */}
      <div className='hidden md:flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>{t("title")}</h1>
          <p className='text-muted-foreground'>
            {getWelcomeMessage(currentLocale)}
          </p>
        </div>
        <Button variant='outline' size='icon'>
          <Bell className='h-5 w-5' />
        </Button>
      </div>
    </div>
  );
}

export default DashboardClientComponent;
