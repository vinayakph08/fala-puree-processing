"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { convertToISOWithoutDateChange } from "@/utils/date-time";
import { useInvalidateFarmerInventory } from "../../hooks/use-farmer-inventory";
import {
  addFarmerInventoryAction,
  updateInventoryAction,
} from "../../server-actions/inventory";
import { getCropHarvestDays } from "@/app/(protected)/inventory/utils";
import { InventoryItem } from "../../types";
import { isEmpty } from "lodash";

interface InventoryFormDialogProps {
  farmerId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editItem?: InventoryItem; // Optional for edit mode
  onSuccess?: () => void;
}

export function InventoryFormDialog({
  farmerId,
  isOpen,
  onOpenChange,
  editItem,
  onSuccess,
}: InventoryFormDialogProps) {
  const t = useTranslations("inventory");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const invalidateFarmerInventory = useInvalidateFarmerInventory();

  // More robust check: editItem exists and has a valid id
  const isEditMode =
    !isEmpty(editItem) &&
    typeof editItem.id === "string" &&
    editItem.id.length > 0;

  // Create schema with translated validation messages
  const formSchema = z.object({
    crop_name: z
      .string({
        message: "Please select a crop",
      })
      .min(1, {
        message: "Please select a crop",
      }),
    number_of_guntas: z
      .number({
        message: "Please enter number of guntas",
      })
      .min(1, {
        message: "Please enter a valid number of guntas",
      }),
    seed_sowed_date: z.date({
      message: "Please select sowed date",
    }),
  });

  type FormData = z.infer<typeof formSchema>;

  // Translated crop options
  const getCropOptions = () => [
    { value: "Spinach", label: "Spinach" },
    { value: "Mint", label: "Mint" },
    { value: "Coriander", label: "Coriander" },
    { value: "Spring Onion", label: "Spring Onion" },
    { value: "Lettuce", label: "Lettuce" },
    { value: "Fenugreek", label: "Fenugreek" },
    { value: "Dill", label: "Dill" },
    { value: "Parsley", label: "Parsley" },
    { value: "Green Onion", label: "Green Onion" },
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

  // Set form values when editing
  useEffect(() => {
    if (isEditMode && isOpen) {
      form.reset({
        crop_name: editItem.crop,
        number_of_guntas: editItem.guntas,
        seed_sowed_date: new Date(editItem.sowedDate),
      });
    } else if (!isOpen) {
      form.reset({
        crop_name: "",
        number_of_guntas: undefined,
      });
    }
  }, [editItem, isOpen, form]);

  // Helper function to handle form cancellation
  const handleCancel = () => {
    form.reset({
      crop_name: "",
      number_of_guntas: undefined,
    });
    onOpenChange(false);
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

      let result;
      if (isEditMode) {
        formData.append("inventory_id", editItem!.id);
        result = await updateInventoryAction(formData);
      } else {
        result = await addFarmerInventoryAction({ formData });
      }

      const { error } = result;

      if (error) {
        toast.error("Error", {
          description: isEditMode
            ? "Failed to update inventory. Please try again."
            : "Failed to add inventory. Please try again.",
        });
        return;
      }

      invalidateFarmerInventory(farmerId);

      toast.success("Success", {
        description: isEditMode
          ? "Inventory updated successfully!"
          : "Inventory added successfully!",
      });

      form.reset({
        crop_name: "",
        number_of_guntas: undefined,
      });
      onOpenChange(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Update Crop" : "Add New Crop"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details for your crop inventory."
              : "Add new crop details to your inventory."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='crop_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isEditMode} // Disable crop selection in edit mode
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select a crop' />
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
                  <FormLabel>Number of Guntas</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Enter number of guntas'
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
                  <FormLabel>Seed Sowed Date</FormLabel>
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
                            <span>Pick a date</span>
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
                Cancel
              </Button>
              <Button type='submit' className='flex-1' disabled={isSubmitting}>
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Adding..."
                  : isEditMode
                  ? "Update Crop"
                  : "Add Crop"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
