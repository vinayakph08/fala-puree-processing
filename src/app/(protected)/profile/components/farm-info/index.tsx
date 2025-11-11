"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useFarmer } from "@/providers/farmer-provider";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

function FarmeInfo() {
  const { farmer, isLoading, error } = useFarmer();
  const t = useTranslations("profile");

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <Skeleton className='h-6 w-32' />
            <Skeleton className='h-8 w-16' />
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <Skeleton className='h-4 w-24 mb-2' />
            <Skeleton className='h-6 w-48' />
          </div>
          <div>
            <Skeleton className='h-4 w-20 mb-2' />
            <Skeleton className='h-5 w-32' />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t("farmInfo")}</CardTitle>
          <CardDescription>{t("farmDescription")}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Add Farm ID and Farm Name  */}

          <div>
            <Label className='text-sm text-muted-foreground'>
              {t("farm.farmId")}
            </Label>
            <p className='font-medium'>{farmer?.farm?.farm_id}</p>
          </div>

          <div>
            <Label className='text-sm text-muted-foreground'>
              {t("farm.farmName")}
            </Label>
            <p className='font-medium'>{farmer?.farm?.farmName}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FarmeInfo;
