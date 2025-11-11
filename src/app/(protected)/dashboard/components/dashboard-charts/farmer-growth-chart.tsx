"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FarmerGrowthData } from "../../../../../types/dashboard";

interface FarmerGrowthProps {
  data?: FarmerGrowthData[];
}

export default function FarmerGrowthChart({ data }: FarmerGrowthProps) {
  // Default/mock data
  const defaultData = data || [
    { month: "Jan", farmers: 65 },
    { month: "Feb", farmers: 72 },
    { month: "Mar", farmers: 78 },
    { month: "Apr", farmers: 85 },
    { month: "May", farmers: 95 },
    { month: "Jun", farmers: 108 },
    { month: "Jul", farmers: 115 },
    { month: "Aug", farmers: 125 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Farmer Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={defaultData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='month' />
            <YAxis />
            <Tooltip />
            <Line
              type='monotone'
              dataKey='farmers'
              stroke='#09ad8d'
              strokeWidth={2}
              dot={{ fill: "#09ad8d" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
