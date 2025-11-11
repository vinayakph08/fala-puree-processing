"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signUpWithMobile } from "@/lib/auth";
import type { UserSignUpData } from "@/types/auth";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { cn } from "@/lib/utils";
import {
  states,
  DistrictsByState,
  VillagesByDistrict,
  adminNumber,
} from "./admin-data";

// Validation schema
const signUpSchema = z.object({
  phone_number: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"),
  password: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .regex(/(?=.*\d)/, "Password must contain a number"),
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  last_name: z.string().max(50, "Last name must be less than 50 characters"),
  state: z
    .object({
      label: z.string(),
      value: z.string(),
      code: z.string(),
    })
    .refine((val) => val.value.length > 0, { message: "State is required" }),
  district: z
    .object({
      label: z.string(),
      value: z.string(),
      code: z.string(),
    })
    .refine((val) => val.value.length > 0, { message: "District is required" }),
  village: z
    .object({
      label: z.string(),
      value: z.string(),
      code: z.string(),
    })
    .refine((val) => val.value.length > 0, { message: "Village is required" }),
  role: z.enum(["FARMER", "CUSTOMER", "ADMIN", "USER"]).default("ADMIN"),
});

type SignUpFormData = z.input<typeof signUpSchema>;
interface FarmerRegistrationFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const FarmerRegistrationForm: React.FC<FarmerRegistrationFormProps> = ({
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("common");
  const locale = useLocale();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: "ADMIN",
    },
  });

  const selectedRole = watch("role");
  const selectedState = watch("state");
  const selectedDistrict = watch("district");

  const availableDistricts = selectedState
    ? DistrictsByState[selectedState.value] || []
    : [];

  const availableVillages = selectedDistrict
    ? VillagesByDistrict[selectedDistrict.value] || []
    : [];

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);

    if (adminNumber.includes(data.phone_number)) {
      data.role = "ADMIN";
    } else {
      onError?.("You are not authorized to create an admin account.");
      setIsLoading(false);
      return;
    }

    try {
      const farmPrefix =
        data.state.code + data.district.code + data.village.code;
      const signUpData: UserSignUpData = {
        ...data,
        state: data.state.value,
        district: data.district.value,
        village: data.village.value,
        farm_id: farmPrefix,
        language_preference:
          (locale as "kn" | "en" | "ta" | "ml" | "te" | "hi") || "en",
        role: data.role || "ADMIN",
      };

      const result = await signUpWithMobile(signUpData);

      if (result.success) {
        onSuccess?.();
      } else {
        onError?.(result.error?.message || t("errors.signupFailed"));
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : t("errors.unknown"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-md mx-auto'>
      {/* <CardHeader>
        <CardTitle className='text-2xl text-center text-primary'>
          {t("auth.signup.title")}
        </CardTitle>
        <CardDescription className='text-center'>
          {t("auth.signup.description")}
        </CardDescription>
      </CardHeader> */}
      <CardContent>
        <div className='flex justify-center'>
          <LanguageToggle />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* First Name */}
          <div className='space-y-2'>
            <div className='flex justify-start gap-1'>
              <Label htmlFor='first_name'>{t("auth.fields.firstName")}</Label>
              <span className='text-rose-600'>*</span>
            </div>
            <Input
              id='first_name'
              type='text'
              placeholder={t("auth.placeholders.firstName")}
              {...register("first_name")}
              className={cn(
                "text-sm",
                errors.first_name ? "border-red-500" : ""
              )}
            />
            {errors.first_name && (
              <p className='text-sm text-red-500'>
                {errors.first_name.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className='space-y-2'>
            <Label htmlFor='last_name'>{t("auth.fields.lastName")}</Label>
            <Input
              id='last_name'
              type='text'
              placeholder={t("auth.placeholders.lastName")}
              {...register("last_name")}
              className={cn(
                "text-sm",
                errors.last_name ? "border-red-500" : ""
              )}
            />
            {errors.last_name && (
              <p className='text-sm text-red-500'>{errors.last_name.message}</p>
            )}
          </div>
          {/* Phone Number */}
          <div className='space-y-2'>
            <div className='flex justify-start gap-1'>
              <Label htmlFor='phone_number'>
                {t("auth.fields.phoneNumber")}
              </Label>
              <span className='text-rose-600'>*</span>
            </div>
            <Input
              id='phone_number'
              type='tel'
              placeholder={t("auth.placeholders.phoneNumber")}
              {...register("phone_number")}
              className={cn(
                "text-sm",
                errors.phone_number ? "border-red-500" : ""
              )}
            />
            {errors.phone_number && (
              <p className='text-sm text-red-500'>
                {errors.phone_number.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className='space-y-2'>
            <div className='flex justify-start gap-1'>
              <Label htmlFor='password'>{t("auth.fields.password")}</Label>
              <span className='text-rose-600'>*</span>
            </div>
            <Input
              id='password'
              type='password'
              placeholder={t("auth.placeholders.password")}
              {...register("password")}
              className={cn("text-sm", errors.password ? "border-red-500" : "")}
            />
            {errors.password && (
              <p className='text-sm text-red-500'>{errors.password.message}</p>
            )}
          </div>

          {/* State */}
          <div className='space-y-2'>
            <div className='flex justify-start gap-1'>
              <Label>{t("auth.fields.state")}</Label>
              <span className='text-rose-600'>*</span>
            </div>
            <Select
              value={selectedState?.value || ""}
              onValueChange={(value) => {
                const stateObject = states.find((s) => s.value === value);
                setValue("state", stateObject);
                setValue("district", { label: "", value: "", code: "" });
                setValue("village", { label: "", value: "", code: "" });
              }}
            >
              <SelectTrigger
                className={cn("w-full", errors.state ? "border-red-500" : "")}
              >
                <SelectValue placeholder={t("auth.placeholders.selectState")} />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && (
              <p className='text-sm text-red-500'>{errors.state.message}</p>
            )}
          </div>

          {/* District */}
          <div className='space-y-2'>
            <div className='flex justify-start gap-1'>
              <Label>{t("auth.fields.district")}</Label>
              <span className='text-rose-600'>*</span>
            </div>
            <Select
              value={selectedDistrict?.value || ""}
              onValueChange={(value) => {
                const districtObject = availableDistricts.find(
                  (d) => d.value === value
                );
                setValue("district", districtObject);
                setValue("village", { label: "", value: "", code: "" });
              }}
              disabled={!selectedState}
            >
              <SelectTrigger
                className={cn(
                  "w-full",
                  errors.district ? "border-red-500" : ""
                )}
              >
                <SelectValue
                  placeholder={t("auth.placeholders.selectDistrict")}
                />
              </SelectTrigger>
              <SelectContent>
                {availableDistricts.map((district) => (
                  <SelectItem key={district.value} value={district.value}>
                    {district.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.district && (
              <p className='text-sm text-red-500'>{errors.district.message}</p>
            )}
          </div>

          {/* Village */}
          <div className='space-y-2'>
            <div className='flex justify-start gap-1'>
              <Label>{t("auth.fields.village")}</Label>
              <span className='text-rose-600'>*</span>
            </div>
            <Select
              value={watch("village")?.value || ""}
              onValueChange={(value) => {
                const villageObject = availableVillages.find(
                  (v) => v.value === value
                );
                setValue("village", villageObject);
              }}
              disabled={!selectedDistrict}
            >
              <SelectTrigger
                className={cn("w-full", errors.village ? "border-red-500" : "")}
              >
                <SelectValue
                  placeholder={t("auth.placeholders.selectVillage")}
                />
              </SelectTrigger>
              <SelectContent>
                {availableVillages.map((village) => (
                  <SelectItem key={village.value} value={village.value}>
                    {village.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.village && (
              <p className='text-sm text-red-500'>{errors.village.message}</p>
            )}
          </div>

          {/* Role Selection */}
          <div className='space-y-2'>
            <div className='flex justify-start gap-1'>
              <Label>{t("auth.fields.role")}</Label>
              <span className='text-rose-600'>*</span>
            </div>
            <Select
              value={selectedRole}
              onValueChange={(value) =>
                setValue("role", value as UserSignUpData["role"])
              }
            >
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ADMIN'>{t("roles.admin")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            className='w-full min-h-[44px]'
            disabled={isLoading}
          >
            {isLoading ? t("common.loading") : t("auth.signup.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
