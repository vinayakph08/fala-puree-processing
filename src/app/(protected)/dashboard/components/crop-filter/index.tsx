"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { fetchAvailableCrops } from "@/lib/dashboard/client-api";

interface CropFilterProps {
  selectedCrop: string;
  onCropChange: (crop: string) => void;
}

export default function CropFilter({
  selectedCrop,
  onCropChange,
}: CropFilterProps) {
  const { data: crops = [] } = useQuery({
    queryKey: ["available-crops"],
    queryFn: fetchAvailableCrops,
  });

  return (
    <div className='flex items-center gap-4 mb-6'>
      <label className='text-sm font-medium'>Filter by Crop:</label>
      <Select value={selectedCrop} onValueChange={onCropChange}>
        <SelectTrigger className='w-48'>
          <SelectValue placeholder='All Crops' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Crops</SelectItem>
          {crops.map((crop: any) => (
            <SelectItem key={crop.crop_name} value={crop.crop_name}>
              {crop.crop_name} ({crop.total_quantity} kg)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
