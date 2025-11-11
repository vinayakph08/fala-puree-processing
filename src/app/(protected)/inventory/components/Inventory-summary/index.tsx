"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Warehouse } from "lucide-react";
import { useTranslations } from "next-intl";
import { InventoryCard } from "../inventory-card";
import { AddCropForm } from "../add-crop-form";

function InventorySummary({ inventory }: { inventory: any }) {
  const t = useTranslations("inventory");

  // Calculate number of unique crops using useMemo to avoid recalculation
  const numberOfCrops = useMemo(() => {
    if (!inventory) return 0;
    const cropNames = new Set();
    inventory.forEach((item) => cropNames.add(item.crop_name));
    return cropNames.size;
  }, [inventory]);

  const numberOfReadyToHarvest = useMemo(() => {
    if (!inventory) return 0;
    const _num = inventory.filter((item) => {
      const harvestDate = new Date(item.harvest_available_date);
      const currentDate = new Date();

      // Compare only dates, not time
      harvestDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      return item.harvest_available_date && harvestDate <= currentDate;
    }).length;
    return _num;
  }, [inventory]);

  return (
    <>
      {inventory?.length > 0 ? (
        <div className='flex flex-col gap-4'>
          {/* Summary Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <Card>
              <CardContent className='p-4'>
                <div className='text-center'>
                  <p className='text-3xl font-bold text-blue-500'>
                    {inventory.length}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {t("stats.totalBatches")}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-4'>
                <div className='text-center'>
                  <p className='text-3xl font-bold text-yellow-500'>
                    {numberOfCrops}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {t("stats.numberOfCrops")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4'>
                <div className='text-center'>
                  <p className='text-3xl font-bold text-primary'>
                    {numberOfReadyToHarvest}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {t("stats.readyToHarvest")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4'>
                <div className='text-center'>
                  <p className='text-3xl font-bold text-orange-500'>
                    {inventory.reduce(
                      (sum, item) => sum + item.total_expected_quantity,
                      0
                    )}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {t("stats.totalStock")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {inventory.map((item) => (
              <InventoryCard key={item.id} inventory={item} />
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className='text-center py-12'>
            <Warehouse className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
            <CardTitle className='mb-2'>{t("empty.title")}</CardTitle>
            <CardDescription className='mb-6'>
              {t("empty.description")}
            </CardDescription>
            {/* <AddCropForm /> */}
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default InventorySummary;
