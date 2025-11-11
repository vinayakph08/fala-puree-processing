"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type IFarmers = {
  id: string;
  farm_id: string;
  name: string;
  location: string;
  lastActive: string;
  totalEarnings: string;
};

export const columns: ColumnDef<IFarmers>[] = [
  {
    accessorKey: "farm_id",
    header: "Farm ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "totalEarnings",
    header: "Total Earnings",
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
  },
];
