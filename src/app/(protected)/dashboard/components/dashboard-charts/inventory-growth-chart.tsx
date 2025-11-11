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
import { InventoryGrowthData } from "../../../../../types/dashboard";

interface InventoryGrowthProps {
  data?: InventoryGrowthData[];
}

export default function InventoryGrowthChart({ data }: InventoryGrowthProps) {
  // Default/mock data
  const defaultData = data || [
    { month: "Jan", inventory: 0 },
    { month: "Feb", inventory: 0 },
    { month: "Mar", inventory: 0 },
    { month: "Apr", inventory: 0 },
    { month: "May", inventory: 0 },
    { month: "Jun", inventory: 0 },
    { month: "Jul", inventory: 0 },
    { month: "Aug", inventory: 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Growth (kg)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={defaultData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='month' />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey='inventory'
              fill='#09ad8d'
              radius={[4, 4, 0, 0]}
              barSize={50}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={800}
              animationEasing='ease-in-out'
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
