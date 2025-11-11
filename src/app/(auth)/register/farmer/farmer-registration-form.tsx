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
import { Card, CardContent } from "@/components/ui/card";
import { signUpWithMobile } from "@/lib/auth";
import type { UserSignUpData } from "@/types/auth";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { cn } from "@/lib/utils";
import { adminNumber } from "./admin-data";

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
  role: z.enum(["ADMIN", "USER"]).default("ADMIN"),
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
  console.log({ isLoading });

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

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    console.log({ data });

    if (adminNumber.includes(data.phone_number)) {
      data.role = "ADMIN";
    } else {
      onError?.("You are not authorized to create an admin account.");
      setIsLoading(false);
      return;
    }

    try {
      const signUpData: UserSignUpData = {
        ...data,

        role: data.role || "ADMIN",
      };

      const result = await signUpWithMobile(signUpData);

      if (result.success) {
        onSuccess?.();
      } else {
        onError?.(result.error?.message);
      }
    } catch (error) {
      onError?.(error.message);
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
              <Label htmlFor='first_name'>First Name</Label>
              <span className='text-rose-600'>*</span>
            </div>
            <Input
              id='first_name'
              type='text'
              placeholder='Enter your first name'
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
            <Label htmlFor='last_name'>Last Name</Label>
            <Input
              id='last_name'
              type='text'
              placeholder='Enter your last name (optional)'
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
              <Label htmlFor='phone_number'>Phone Number</Label>
              <span className='text-rose-600'>*</span>
            </div>
            <Input
              id='phone_number'
              type='tel'
              placeholder='Enter your 10-digit mobile number'
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
              <Label htmlFor='password'>Password</Label>
              <span className='text-rose-600'>*</span>
            </div>
            <Input
              id='password'
              type='password'
              placeholder={"Enter your password"}
              {...register("password")}
              className={cn("text-sm", errors.password ? "border-red-500" : "")}
            />
            {errors.password && (
              <p className='text-sm text-red-500'>{errors.password.message}</p>
            )}
          </div>

          {/* Role Selection */}
          <div className='space-y-2'>
            <div className='flex justify-start gap-1'>
              <Label>Role</Label>
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
                <SelectItem value='ADMIN'>Admin</SelectItem>
                <SelectItem value='USER'>User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            className='w-full min-h-[44px]'
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
