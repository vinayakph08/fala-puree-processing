import { format } from "date-fns";
import { IFarmers } from "../components/data-table/columns";

export const getMappedData = (data: any[]): IFarmers[] => {
  return data.map((item: any) => ({
    id: item.id,
    farm_id: getFarmId(item.farm),
    name: `${item.first_name_en ? item.first_name_en : item.first_name} ${
      item.last_name_en ? item.last_name_en : item.last_name
    }`,
    location: getLocation({
      village: item.village,
      district: item.district,
      state: item.state,
    }),

    lastActive: format(item.updated_at, "PPp"),
    totalEarnings: `${item.totalEarnings || "N/A"}`,
  }));
};

const getFarmId = (farm: any) => {
  return farm?.[0]?.farm_id || "N/A";
};

const capitalizeWords = (text: string) => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const getLocation = ({
  village,
  district,
  state,
}: {
  village: string;
  district?: string;
  state?: string;
}) => {
  return `${capitalizeWords(village)}, ${capitalizeWords(district)}`;
};

export const getMappedFarmerData = (farmer: any) => {
  if (!farmer) return null;
  return {
    farmerName: `${
      farmer.first_name_en ? farmer.first_name_en : farmer.first_name
    } ${farmer.last_name_en ? farmer.last_name_en : farmer.last_name}`,
    location: getLocation({
      village: farmer.village,
      district: farmer.district,
      state: farmer.state,
    }),
    farmId: getFarmId(farmer.farm),
    phoneNumber: "+91-" + farmer.mobile_number || "N/A",
    email: farmer.email || "N/A",
    farmSize: farmer.farm?.[0]?.farm_size || "N/A",
    status: farmer.is_active ? "Active" : "Inactive",
    images: farmer.farm?.[0]?.images || [],
  };
};
export const getMappedInventoryData = (inventory: any[]) => {
  if (!inventory) return [];
  return inventory.map((item: any) => ({
    id: item.id,
    crop: item.crop_name || "N/A",
    guntas: item.number_of_guntas || 0,
    availableInventory: item.total_expected_quantity || 0,
    sowedDate: item.seed_sowed_date
      ? format(item.seed_sowed_date, "PP")
      : "N/A",
    harvestDate: item.harvest_available_date
      ? format(new Date(item.harvest_available_date), "PP")
      : "N/A",
    status: item.status || "N/A",
  }));
};
