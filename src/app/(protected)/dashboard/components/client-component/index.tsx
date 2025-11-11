"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFarmer } from "@/providers/farmer-provider";
import { useTranslations } from "next-intl";
import { useLocaleContext } from "@/providers/locale-provider";
import KeyMetricsCards from "../key-metrics-cards";
import CropFilter from "../crop-filter";
import {
  FarmerGrowthChart,
  InventoryUsageChart,
  InventoryGrowthChart,
  FarmerHarvestableInventoryChart,
} from "../dashboard-charts";
import { useDashboardData } from "../../hooks";

function DashboardClientComponent() {
  const t = useTranslations("dashboard");
  const { currentLocale } = useLocaleContext();
  const { getWelcomeMessage } = useFarmer();
  const [selectedCrop, setSelectedCrop] = useState<string>("all");

  const cropFilter = selectedCrop === "all" ? undefined : selectedCrop;

  // Fetch dashboard data using custom hook with crop filter
  const {
    metrics,
    farmerGrowthData,
    inventoryUsageData,
    inventoryGrowthData,
    farmerHarvestableInventoryData,
  } = useDashboardData(cropFilter);

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

      {/* Crop Filter */}
      <CropFilter selectedCrop={selectedCrop} onCropChange={setSelectedCrop} />

      {/* Key Metrics Cards */}
      <KeyMetricsCards metrics={metrics} />

      {/* Farmer Harvestable Inventory Chart */}
      <FarmerHarvestableInventoryChart data={farmerHarvestableInventoryData} />

      {/* Dashboard Charts */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <div className='md:col-span-2'>
          <FarmerGrowthChart data={farmerGrowthData} />
        </div>
        <div>
          <InventoryUsageChart data={inventoryUsageData} />
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-1'>
        <InventoryGrowthChart data={inventoryGrowthData} />
      </div>

      {/* Earnings  */}
      {/* <Earnings /> */}

      {/* Current Orders */}
      {/* <div>
        <h2 className='text-lg font-semibold mb-4'>{t("orders.title")}</h2>
        <div className='space-y-3'>
          {orders.map((order) => (
            <Card key={order.id} className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                  <Package className='w-5 h-5 text-primary' />
                </div>
                <div className='flex-1'>
                  <h3 className='font-medium'>{order.title}</h3>
                  <p className='text-sm text-muted-foreground'>{order.due}</p>
                </div>
                <p className='font-medium'>{order.quantity}</p>
              </div>
            </Card>
          ))}
        </div>
      </div> */}

      {/* Current Inventory */}
      {/* <CurrentInventory /> */}

      {/* Growing Crops */}
      {/* <div>
        <h2 className='text-lg font-semibold mb-4'>
          {t("crops.title")}
        </h2>
        <div className='grid grid-cols-2 gap-4'>
          {crops.map((crop) => (
            <Card key={crop.name} className='p-4'>
              <h3 className='font-medium text-primary'>{crop.name}</h3>
              <p className='text-xs text-muted-foreground mt-1'>
                {t("crops.capacityPerYear")}
              </p>
              <p className='text-lg font-bold'>{crop.capacity}</p>
            </Card>
          ))}
        </div>
      </div> */}
    </div>
  );
}

export default DashboardClientComponent;
