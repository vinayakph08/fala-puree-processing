export interface InventoryItem {
  id: string;
  crop: string;
  guntas: number;
  availableInventory: number;
  sowedDate: string;
  harvestDate: string;
  status:
    | "Sowed"
    | "Growing"
    | "Ready to Harvest"
    | "Harvested"
    | "Sold"
    | string;
}

export type addInventoryType = Pick<
  InventoryItem,
  "crop" | "guntas" | "sowedDate"
>;

export interface FarmDetailsData {
  farmerName: string;
  location: string;
  farmId: string;
  images: string[];
  phoneNumber?: string;
  email?: string;
  farmSize?: string;
  soilType?: string;
  status?: "Active" | "Inactive" | "Pending" | string;
}
