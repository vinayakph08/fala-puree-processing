"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, PlusIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
// import { uploadImage } from "@/components/image-upload";
import { addInventoryAction } from "../server-actions";
import { useInvalidateInventory } from "../hooks/use-inventory";
import { useRouter } from "next/navigation";
import { convertToISOWithoutDateChange } from "@/utils/date-time";
import { getCropHarvestDays } from "../utils";
import { addFarmerInventoryAction } from "../../farmers/server-actions/inventory";

interface AddCropFormProps {
  farmerId: string;
  onSuccess?: () => void;
}

export function AddCropForm({ farmerId, onSuccess }: AddCropFormProps) {
  const t = useTranslations("inventory");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const invalidateInventory = useInvalidateInventory();
  const router = useRouter();

  // Create schema with translated validation messages
  const formSchema = z.object({
    crop_name: z
      .string({
        message: t("form.validation.selectCrop"),
      })
      .min(1, {
        message: t("form.validation.selectCrop"),
      }),
    number_of_guntas: z
      .number({
        message: t("form.validation.guntas"),
      })
      .min(1, {
        message: t("form.validation.guntas"),
      }),
    seed_sowed_date: z.date({
      message: t("form.validation.sowedDate"),
    }),
  });

  type FormData = z.infer<typeof formSchema>;

  // Translated crop options
  const getCropOptions = () => [
    { value: "Spinach", label: t("form.crops.spinach") },
    { value: "Mint", label: t("form.crops.mint") },
    { value: "Coriander", label: t("form.crops.coriander") },
    { value: "Spring Onion", label: t("form.crops.springonion") },
    { value: "Lettuce", label: t("form.crops.lettuce") },
    { value: "Fenugreek", label: t("form.crops.fenugreek") },
    { value: "Dill", label: t("form.crops.dill") },
    { value: "Parsley", label: t("form.crops.parsley") },
    { value: "Green Onion", label: t("form.crops.greenonion") },
  ];

  const cropOptions = getCropOptions();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crop_name: "",
      number_of_guntas: undefined,
    },
  });

  const selectedCrop = form.watch("crop_name");

  // Helper function to handle form cancellation
  const handleCancel = () => {
    form.reset({
      crop_name: "",
      number_of_guntas: undefined,
    });
    setOpen(false);
  };

  // Handle dialog open/close state changes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when dialog is closed
      form.reset({
        crop_name: "",
        number_of_guntas: undefined,
      });
    }
    setOpen(newOpen);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Convert form data to FormData object
      const formData = new FormData();
      formData.append("crop_name", data.crop_name);
      formData.append("number_of_guntas", data.number_of_guntas.toString());
      formData.append(
        "seed_sowed_date",
        convertToISOWithoutDateChange(data.seed_sowed_date)
      );
      formData.append("farmer_id", farmerId);

      const { data: addedInventory, error } = await addFarmerInventoryAction({
        formData,
      });

      if (error) {
        toast.error(t("form.toast.error"), {
          description: t("form.toast.errorDescription"),
        });
        return;
      }

      invalidateInventory();

      toast.success(t("form.toast.success"), {
        description: t("form.toast.successDescription"),
      });

      form.reset({
        crop_name: "",
        number_of_guntas: undefined,
      });
      setOpen(false);
      router.push("/inventory");
    } catch (error) {
      toast.error(t("form.toast.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className='h-4 w-4' color='#fff' />
          <span>{t("form.addCrop")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{t("form.addNewCrop")}</DialogTitle>
          <DialogDescription>{t("form.addCropDescription")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='crop_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.cropType")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder={t("form.selectCrop")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cropOptions.map((crop) => (
                        <SelectItem key={crop.value} value={crop.value}>
                          {crop.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='number_of_guntas'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.numberOfGuntas")}</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder={t("form.enterNumberOfGuntas")}
                      min={1}
                      step={1}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          field.onChange(undefined);
                        } else {
                          const numValue = Number(value);
                          if (!isNaN(numValue) && numValue > 0) {
                            field.onChange(numValue);
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='seed_sowed_date'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>{t("form.startDate")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>{t("form.pickDate")}</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(date);
                          }
                        }}
                        disabled={(date) => {
                          const NumberOfDaysToHarvest = new Date();
                          NumberOfDaysToHarvest.setDate(
                            NumberOfDaysToHarvest.getDate() -
                              getCropHarvestDays(selectedCrop)
                          );
                          return date < NumberOfDaysToHarvest;
                        }}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex gap-2 pt-4'>
              <Button
                type='button'
                variant='outline'
                className='flex-1'
                onClick={handleCancel}
              >
                {t("form.cancel")}
              </Button>
              <Button type='submit' className='flex-1' disabled={isSubmitting}>
                {isSubmitting ? t("form.adding") : t("form.addCrop")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
