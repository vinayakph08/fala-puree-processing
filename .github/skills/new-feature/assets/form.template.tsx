// @ts-nocheck
// src/app/(protected)/(main-pages)/[feature]/components/[feature]-form/index.tsx
// Replace [feature], schema name, action, and field names throughout.

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { createFeatureSchema, type CreateFeatureFormData } from "../../utils";
import { createFeatureAction } from "../../server-actions";
import { FEATURE_KEYS } from "../../utils/query-keys";

// ─── Create Form ─────────────────────────────────────────────────────────────

interface CreateFeatureFormProps {
  onSuccess?: () => void;
}

export const CreateFeatureForm = ({ onSuccess }: CreateFeatureFormProps) => {
  const t = useTranslations("feature");
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateFeatureFormData>({
    resolver: zodResolver(createFeatureSchema),
    defaultValues: {
      name: "",
      status: "active",
    },
  });

  const handleOpenChange = (next: boolean) => {
    if (!next) form.reset();
    setOpen(next);
  };

  const onSubmit = async (data: CreateFeatureFormData) => {
    setIsSubmitting(true);
    try {
      // Server actions receive typed data — convert to FormData if the action expects it
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("status", data.status);

      const result = await createFeatureAction(formData);

      if (result.error) {
        toast.error(t("form.toast.error"));
        return;
      }

      toast.success(t("form.toast.success"));
      queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.all });
      form.reset();
      setOpen(false);
      onSuccess?.();
    } catch {
      toast.error(t("form.toast.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="min-h-[44px]">{t("form.addButton")}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("form.createTitle")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Text Input field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.fields.name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.fields.namePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Select field */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.fields.status")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("form.fields.statusPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">{t("status.active")}</SelectItem>
                      <SelectItem value="inactive">{t("status.inactive")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Number Input field */}
            {/*
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.fields.quantity")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        field.onChange(v === "" ? undefined : Number(v));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            */}

            {/* Date Picker field */}
            {/*
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("form.fields.date")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal min-h-[44px]",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>{t("form.fields.datePlaceholder")}</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => date && field.onChange(date)}
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            */}

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 min-h-[44px]"
                onClick={() => handleOpenChange(false)}
              >
                {t("form.cancel")}
              </Button>
              <Button
                type="submit"
                className="flex-1 min-h-[44px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("form.saving") : t("form.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// ─── Edit Form ────────────────────────────────────────────────────────────────
// Edit forms: reset with existing data via useEffect — never pass undefined as defaultValues

/*
import { useEffect } from "react";
import { updateFeatureSchema, type UpdateFeatureFormData } from "../../utils";
import { updateFeatureAction } from "../../server-actions";
import type { IFeatureItem } from "@/types/feature";

interface EditFeatureFormProps {
  item: IFeatureItem;
  onSuccess?: () => void;
}

export const EditFeatureForm = ({ item, onSuccess }: EditFeatureFormProps) => {
  const t = useTranslations("feature");
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateFeatureFormData>({
    resolver: zodResolver(updateFeatureSchema),
    defaultValues: { name: "", status: "active" },  // always set safe empty defaults
  });

  // Populate with existing data when item is available
  useEffect(() => {
    if (item) {
      form.reset({ name: item.name, status: item.status });
    }
  }, [item, form]);

  const onSubmit = async (data: UpdateFeatureFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("status", data.status);

      const result = await updateFeatureAction(item.id, formData);
      if (result.error) { toast.error(t("form.toast.updateError")); return; }

      toast.success(t("form.toast.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.detail(item.id) });
      onSuccess?.();
    } catch {
      toast.error(t("form.toast.updateError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField ... />
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? t("form.saving") : t("form.update")}</Button>
      </form>
    </Form>
  );
};
*/
