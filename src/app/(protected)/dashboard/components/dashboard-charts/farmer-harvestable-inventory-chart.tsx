"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FarmerHarvestableInventoryData } from "@/types/dashboard";
import { useRouter } from "next/navigation";

interface FarmerHarvestableInventoryChartProps {
  data?: FarmerHarvestableInventoryData[];
}

export default function FarmerHarvestableInventoryChart({
  data,
}: FarmerHarvestableInventoryChartProps) {
  const router = useRouter();
  // Transform data to aggregate by farmer name for better visualization
  const transformedData = data
    ? data
        .reduce((acc: any[], item) => {
          const existingFarmer = acc.find(
            (farmer) => farmer.farmer_name === item.farmer_name
          );

          if (existingFarmer) {
            existingFarmer.harvestable_quantity += item.harvestable_quantity;
          } else {
            acc.push({
              farmer_id: item.farmer_id,
              farm_id: item.farm_id,
              farmer_name: item.farmer_name,
              crop_name: item.crop_name,
              harvestable_quantity: item.harvestable_quantity,
            });
          }

          return acc;
        }, [])
        .sort((a, b) => b.harvestable_quantity - a.harvestable_quantity)
        .slice(0, 10) // Top 10 farmers
    : [];

  // Default/mock data
  const defaultData = transformedData.length > 0 ? transformedData : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-background border rounded-lg p-3 shadow-md'>
          <p className='font-medium'>{`${label}`}</p>
          <p className='text-primary'>
            {`Harvestable Quantity: ${payload[0].value} kg`}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data: any, index: number) => {
    const farmerId = data.farmer_id;
    router.push(`/farmers/${farmerId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Farmers vs Harvestable Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart
            data={defaultData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            barCategoryGap='20%'
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='farmer_name'
              angle={-45}
              textAnchor='end'
              height={80}
              interval={0}
              fontSize={12}
            />
            <YAxis
              label={{
                value: "Quantity (kg)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar
              dataKey='harvestable_quantity'
              fill='#10b981'
              radius={[4, 4, 0, 0]}
              barSize={50}
              onClick={handleBarClick}
              style={{ cursor: "pointer" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
