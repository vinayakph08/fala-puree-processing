export const getCapacityOfCropPerGunta = ({ crop }: { crop: string }) => {
  // Mock implementation, replace with actual logic
  // season based crop data will be changes.

  const cropCapacityForSeason = {
    winter: {
      spinach: 200,
      mint: 120,
      coriander: 150,
    },
    summer: {
      spinach: 200,
      mint: 120,
      coriander: 150,
    },
  };
  const currentSeason = "winter"; // Replace with actual logic to get current season
  return cropCapacityForSeason[currentSeason][crop.toLocaleLowerCase()] || 100;
};

export const getNumberOfCrops = (inventory) => {
  const cropNames = new Set();
  inventory.forEach((item) => cropNames.add(item.crop_name));
  return cropNames.size;
};

export const getMappedInventory = (inventory) => {
  const _inventory = inventory.reduce((acc, item) => {
    const { crop_name, quantity, ...rest } = item;
    if (!acc[crop_name]) {
      acc[crop_name] = { crop_name, total_quantity: 0, items: [] };
    }
    acc[crop_name].total_quantity += quantity;
    acc[crop_name].items.push(rest);
    return acc;
  }, {});
  return Object.values(_inventory);
};

export const getCropHarvestDays = (cropName: string) => {
  const cropHarvestDaysMap: Record<string, number> = {
    spinach: 30,
    mint: 90,
    coriander: 30,
    "spring onion": 60,
    lettuce: 30,
    fenugreek: 35,
    dill: 40,
    parsley: 70,
    "green onion": 60,
  };
  return cropHarvestDaysMap[cropName.toLowerCase()] || 0;
};
