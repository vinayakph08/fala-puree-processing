import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import React from "react";

function Earnings() {
  const t = useTranslations("dashboard");

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>{t("earnings.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-sm text-muted-foreground'>
              {t("earnings.weekly")}
            </p>
            <p className='text-2xl font-bold'>10,000</p>
          </div>
          <div className='text-right'>
            <p className='text-sm text-muted-foreground'>
              {t("earnings.total")}
            </p>
            <p className='text-2xl font-bold'>50,000</p>
          </div>
        </div>
        {/* Dots indicator */}
        <div className='flex justify-center gap-1 mt-4'>
          <div className='w-2 h-2 rounded-full bg-primary'></div>
          <div className='w-2 h-2 rounded-full bg-muted'></div>
          <div className='w-2 h-2 rounded-full bg-muted'></div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Earnings;
