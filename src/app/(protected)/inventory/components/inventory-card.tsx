import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sprout, Star, Calendar, Package } from "lucide-react";
import { format, parseISO, isFuture, isToday, isPast } from "date-fns";
import { useTranslations } from "next-intl";
import CardMenu from "./card-menu";
import { cn } from "@/lib/utils";

interface Inventory {
  id: string;
  farmer_id: string;
  crop_name: string;
  number_of_guntas: number;
  seed_sowed_date: string;
  harvest_available_date: string;
  total_expected_quantity: number;
  is_available: boolean;
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
  created_at: string;
  updated_at: string;
  crop_location: string | null;
  crop_imageurl: string | null;
  quality_rating?: number | null;
}

interface InventoryCardProps {
  inventory: Inventory;
}

export function InventoryCard({ inventory }: InventoryCardProps) {
  const t = useTranslations("inventory");
  const seedPlantedDate = parseISO(inventory.seed_sowed_date);
  const harvestAvailableDate = parseISO(inventory.harvest_available_date);

  // Function to get translated crop name
  const getTranslatedCropName = (cropName: string) => {
    const cropKey = cropName.toLowerCase().replace(/\s+/g, "");
    const translationKey = `form.crops.${cropKey}`;

    // Try to get translation, fallback to original name if not found
    const translatedName = t(translationKey);
    return translatedName === translationKey ? cropName : translatedName;
  };

  const getHarvestStatus = () => {
    if (isPast(harvestAvailableDate) || isToday(harvestAvailableDate)) {
      return {
        label: t("card.readyToHarvest"),
        variant: "default" as const,
        className: "bg-primary hover:bg-secondary text-white",
        border: "border-l-primary",
        background: "from-primary/5 to-primary/10",
        text: "text-primary",
      };
    }
    if (isFuture(harvestAvailableDate)) {
      return {
        label: t("card.growing"),
        variant: "secondary" as const,
        className: "bg-yellow-500 hover:bg-yellow-600 text-white",
        border: "border-l-yellow-500",
        background: "from-yellow-500/5 to-yellow-500/10",
        text: "text-yellow-700",
      };
    }
    return {
      label: t("card.pending"),
      variant: "outline" as const,
      className: "",
      border: "border-l-muted",
      background: "from-muted/5 to-muted/10",
      text: "text-muted-foreground",
    };
  };

  const harvestStatus = getHarvestStatus();

  return (
    <Card
      className={cn(
        "hover:shadow-lg transition-all duration-200 border-l-4 ",
        harvestStatus.border
      )}
    >
      <CardHeader className=''>
        <div className='flex items-start justify-between gap-1'>
          <div className='flex-1'>
            <CardTitle className='text-xl flex items-center gap-3 mb-1'>
              <Sprout className={cn("h-6 w-6", harvestStatus.text)} />
              {getTranslatedCropName(inventory.crop_name)}
            </CardTitle>
            <CardDescription className='flex items-center gap-2'>
              <Package className='h-4 w-4' />
              {inventory.number_of_guntas}{" "}
              {inventory.number_of_guntas === 1
                ? t("card.gunta")
                : t("card.guntas")}
            </CardDescription>
          </div>
          <Badge
            variant={harvestStatus.variant}
            className={`${harvestStatus.className} font-medium`}
          >
            {harvestStatus.label}
          </Badge>
          <CardMenu cardId={inventory.id} />
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Expected Harvest */}
        <div
          className={cn(
            "bg-gradient-to-r rounded-lg p-4",
            harvestStatus.background
          )}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Package className={cn("h-5 w-5", harvestStatus.text)} />
              <span className='font-medium text-foreground'>
                {t("card.expectedHarvest")}
              </span>
            </div>
            <span className={cn("text-xl font-bold", harvestStatus.text)}>
              {inventory.total_expected_quantity} Kg
            </span>
          </div>
        </div>

        {/* Date Information - Compact Layout */}
        <div className='bg-muted/30 rounded-lg p-3 space-y-2'>
          <div className='flex items-center gap-2 mb-2'>
            <Calendar className={cn("h-4 w-4", harvestStatus.text)} />
            <span className='text-sm font-medium text-foreground'>
              {t("card.timeline")}
            </span>
          </div>

          <div className='grid grid-cols-2 gap-3 text-sm'>
            <div className='space-y-1'>
              <p className='text-xs text-muted-foreground font-medium'>
                {t("card.planted")}
              </p>
              <p className='font-medium text-foreground'>
                {format(seedPlantedDate, "MMM d")}
              </p>
            </div>

            <div className='space-y-1'>
              <p className='text-xs text-muted-foreground font-medium'>
                {t("card.harvest")}
              </p>
              <p
                className={`font-medium ${
                  isPast(harvestAvailableDate) || isToday(harvestAvailableDate)
                    ? "text-green-600 font-semibold"
                    : "text-foreground"
                }`}
              >
                {format(harvestAvailableDate, "MMM d")}
              </p>
            </div>
          </div>
        </div>

        {/* Quality Rating */}
        {inventory.quality_rating && (
          <div className='flex items-center justify-between p-3 rounded-lg bg-muted/50'>
            <span className='text-sm font-medium text-muted-foreground'>
              {t("card.qualityRating")}
            </span>
            <div className='flex items-center gap-1'>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= inventory.quality_rating!
                      ? "text-yellow-400 fill-current"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
              <span className='ml-1 text-sm font-medium'>
                {inventory.quality_rating}/5
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
