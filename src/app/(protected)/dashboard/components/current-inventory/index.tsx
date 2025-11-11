import { useInventory } from "@/app/(protected)/inventory/hooks/use-inventory";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sprout, Calendar, Package, Warehouse } from "lucide-react";
import { format, parseISO, isToday, isPast } from "date-fns";

interface InventoryItem {
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
}

const CurrentInventoryCard = ({ item }: { item: InventoryItem }) => {
  const t = useTranslations("inventory");

  const seedSowedDate = parseISO(item.seed_sowed_date);
  const harvestAvailableDate = parseISO(item.harvest_available_date);

  // Function to get translated crop name
  const getTranslatedCropName = (cropName: string) => {
    const cropKey = cropName.toLowerCase().replace(/\s+/g, "");
    const translationKey = `card.${cropKey}`;

    // Try to get translation, fallback to original name if not found
    const translatedName = t(translationKey);
    return translatedName === translationKey ? cropName : translatedName;
  };

  return (
    <Card className='hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary'>
      <CardHeader className=''>
        <div className='flex items-center justify-between'>
          <div className='flex-1'>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Sprout className='h-5 w-5 text-primary' />
              {getTranslatedCropName(item.crop_name)}
            </CardTitle>
          </div>
          <Badge className='bg-primary hover:bg-primary text-white font-medium'>
            {t("card.readyToHarvest")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='space-y-3'>
        {/* Expected Quantity */}
        <div className='bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Package className='h-4 w-4 text-primary' />
              <span className='font-medium text-foreground text-sm'>
                {t("card.expectedHarvest")}
              </span>
            </div>
            <span className='text-lg font-bold text-primary'>
              {item.total_expected_quantity} Kg
            </span>
          </div>
        </div>

        {/* Date Information */}
        <div className='bg-muted/30 rounded-lg p-3'>
          <div className='flex items-center gap-2 mb-2'>
            <Calendar className='h-4 w-4 text-primary' />
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
                {format(seedSowedDate, "MMM d")}
              </p>
            </div>

            <div className='space-y-1'>
              <p className='text-xs text-muted-foreground font-medium'>
                {t("card.harvest")}
              </p>
              <p className='font-medium text-primary'>
                {format(harvestAvailableDate, "MMM d")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CurrentInventory = () => {
  const t = useTranslations("inventory");
  const { inventory, error, isLoading } = useInventory();

  // Filter only items that are available for harvest (harvest date is today or past)
  const availableItems =
    inventory?.filter((item: InventoryItem) => {
      const harvestDate = parseISO(item.harvest_available_date);
      return (
        item.is_available &&
        !item.is_deleted &&
        (isPast(harvestDate) || isToday(harvestDate))
      );
    }) || [];

  if (inventory && inventory.length === 0) {
    return (
      <div className='min-h-[80vh] flex justify-center items-center'>
        <Card>
          <CardContent className='text-center py-12'>
            <Warehouse className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
            <CardTitle className='mb-2'>{t("empty.title")}</CardTitle>
            <CardDescription className='mb-6'>
              {t("empty.description")}
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2 mb-4'>
        <Sprout className='h-5 w-5 text-primary' />
        <h2 className='text-lg font-semibold text-foreground'>
          {t("current.title")}
        </h2>
        <Badge variant='secondary' className='ml-auto'>
          {availableItems.length}{" "}
          {availableItems.length === 1 ? t("current.crop") : t("current.crops")}
        </Badge>
      </div>

      {isLoading && (
        <Card>
          <CardContent>
            <div className='flex items-center justify-center p-6'>
              <div className='text-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2'></div>
                <p className='text-sm text-muted-foreground'>
                  {t("common.loading")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent>
            <div className='flex items-center justify-center p-6'>
              <p className='text-sm text-red-600'>{t("messages.error")}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {availableItems.length === 0 && !isLoading && (
        <Card>
          <CardContent className='text-center'>
            <div className='flex items-center justify-center p-6'>
              <div className='text-center'>
                <Sprout
                  className='h-12 w-12 text-primary mx-auto mb-3'
                  color='#09ad8d'
                />
                <h3 className='text-lg font-medium text-foreground mb-1'>
                  {t("empty.title")}
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {t("empty.noHarvest")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className='grid gap-4 overflow-y-auto max-h-[60vh] md:max-h-[40vh] lg:max-h-[60vh] inventory-scroll px-1'>
        {availableItems.map((item: InventoryItem) => (
          <CurrentInventoryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default CurrentInventory;
