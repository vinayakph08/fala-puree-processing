"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, Package, TrendingUp } from "lucide-react";
import { DashboardMetrics } from "../../../../../types/dashboard";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const MetricCard = ({ title, value, icon, trend }: MetricCardProps) => (
  <Card>
    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
      <CardTitle className='text-sm font-medium'>{title}</CardTitle>
      <div className='h-4 w-4 text-muted-foreground'>{icon}</div>
    </CardHeader>
    <CardContent>
      <div className='text-2xl font-bold'>{value}</div>
      {trend && (
        <p
          className={`text-xs ${
            trend.isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend.value} from last month
        </p>
      )}
    </CardContent>
  </Card>
);

interface KeyMetricsCardsProps {
  metrics?: DashboardMetrics;
}

export default function KeyMetricsCards({ metrics }: KeyMetricsCardsProps) {
  // Default/mock data for now
  const defaultMetrics = {
    totalFarmers: metrics?.totalFarmers || 0,
    totalLandSown: metrics?.totalLandSown || 0,
    totalInventory: metrics?.totalInventory || 0,
    currentInventory: metrics?.currentInventory || 0,
  };

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <MetricCard
        title='Total Farmers'
        value={defaultMetrics.totalFarmers}
        icon={<Users className='h-4 w-4' />}
        // trend={{ value: "+12%", isPositive: true }}
      />
      <MetricCard
        title='Total Land Sown'
        value={`${defaultMetrics.totalLandSown} Guntas`}
        icon={<MapPin className='h-4 w-4' />}
        // trend={{ value: "+8%", isPositive: true }}
      />
      <MetricCard
        title='Total Available Inventory'
        value={`${defaultMetrics.totalInventory} kg`}
        icon={<Package className='h-4 w-4' />}
        // trend={{ value: "+23%", isPositive: true }}
      />
      <MetricCard
        title='Current Available Inventory'
        value={`${defaultMetrics.currentInventory} kg`}
        icon={<TrendingUp className='h-4 w-4' />}
        // trend={{ value: "-5%", isPositive: false }}
      />
    </div>
  );
}
