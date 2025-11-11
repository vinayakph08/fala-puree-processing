"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFarmer } from "@/providers/farmer-provider";
import { use, useState } from "react";
import { toast } from "sonner";
import { UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocaleContext } from "@/providers/locale-provider";

export function FarmerProfileCard() {
  const {
    farmer,
    updateName,
    updateTitle,
    getDisplayName,
    isKannadaText,
    isLoading,
    error,
    isUpdating,
  } = useFarmer();
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const { currentLocale } = useLocaleContext();
  const [isEditing, setIsEditing] = useState(false);
  const [tempFirstName, setTempFirstName] = useState("");
  const [tempLastName, setTempLastName] = useState("");
  const [tempTitle, setTempTitle] = useState<"sri" | "srimati">(farmer.title);

  // Initialize temp values when editing starts
  const handleEditStart = () => {
    // Get current name in the UI language
    const currentName =
      currentLocale === "kn"
        ? {
            first: farmer.firstNameKn || farmer.firstName,
            last: farmer.lastNameKn || farmer.lastName,
          }
        : {
            first: farmer.firstNameEn || farmer.firstName,
            last: farmer.lastNameEn || farmer.lastName,
          };

    setTempFirstName(currentName.first);
    setTempLastName(currentName.last || "");
    setTempTitle(farmer.title);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateName(tempFirstName, tempLastName);
      await updateTitle(tempTitle);
      setIsEditing(false);
      toast.success(tCommon("messages.profileUpdated"));
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(tCommon("errors.profileUpdateFailed"));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Get placeholder text based on current UI language
  const getPlaceholder = (field: "firstName" | "lastName") => {
    if (currentLocale === "kn") {
      return field === "firstName" ? "ಮೊದಲ ಹೆಸರು" : "ಕೊನೆಯ ಹೆಸರು";
    }
    return field === "firstName" ? "First Name" : "Last Name";
  };

  // Show loading skeleton while fetching profile
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <Skeleton className='h-6 w-32' />
            <Skeleton className='h-8 w-16' />
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <Skeleton className='h-4 w-24 mb-2' />
            <Skeleton className='h-6 w-48' />
          </div>
          <div>
            <Skeleton className='h-4 w-20 mb-2' />
            <Skeleton className='h-5 w-32' />
          </div>
          <div>
            <Skeleton className='h-4 w-20 mb-2' />
            <Skeleton className='h-5 w-28' />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state if profile fetch failed
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-red-600'>
            {tCommon("errors.loadProfileFailed")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            {tCommon("errors.tryAgainLater")}
          </p>
          <Button className='mt-2' onClick={() => window.location.reload()}>
            {tCommon("buttons.retry")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <div className='flex justify-start items-center gap-1'>
            <div className='p-3 bg-primary/20 rounded-full'>
              <UserIcon className='h-5 w-5 rounded-full' color={"#09ad8d"} />
            </div>
            <div className='flex flex-col justify-start gap-1'>
              <div>{t("farmerInfo")}</div>
              <div className='font-light text-xs text-muted-foreground'>
                {t("farmerDescription")}
              </div>
            </div>
          </div>
          {!isEditing && (
            <Button size='sm' onClick={handleEditStart}>
              {tCommon("buttons.editProfile")}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {!isEditing ? (
          <>
            <div>
              <Label className='text-sm text-muted-foreground'>
                {t("displayName")}
              </Label>
              <p className='font-medium'>{getDisplayName(currentLocale)}</p>
            </div>

            <div>
              <Label className='text-sm text-muted-foreground'>
                {t("firstName")}
              </Label>
              <p className='font-medium'>
                {currentLocale === "kn"
                  ? farmer.firstNameKn || farmer.firstName
                  : farmer.firstNameEn || farmer.firstName}
              </p>
            </div>
            {((currentLocale === "kn" && farmer.lastNameKn) ||
              (currentLocale === "en" && farmer.lastNameEn) ||
              farmer.lastName) && (
              <div>
                <Label className='text-sm text-muted-foreground'>
                  {t("lastName")}
                </Label>
                <p className='font-medium'>
                  {currentLocale === "kn"
                    ? farmer.lastNameKn || farmer.lastName
                    : farmer.lastNameEn || farmer.lastName}
                </p>
              </div>
            )}
            <div>
              <Label className='text-sm text-muted-foreground'>
                {t("mobileNumber")}
              </Label>
              <p className='font-medium'>{farmer?.mobileNumber}</p>
            </div>
          </>
        ) : (
          <>
            <div className='space-y-2'>
              <Label htmlFor='title'>{t("titleField")}</Label>
              <Select
                value={tempTitle}
                onValueChange={(value: "sri" | "srimati") =>
                  setTempTitle(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='sri'>
                    {currentLocale === "kn" ? "ಶ್ರೀ" : "Mr."}
                  </SelectItem>
                  <SelectItem value='srimati'>
                    {currentLocale === "kn" ? "ಶ್ರೀಮತಿ" : "Mrs."}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='firstName'>{t("firstName")}</Label>
              <Input
                id='firstName'
                value={tempFirstName}
                onChange={(e) => setTempFirstName(e.target.value)}
                placeholder={getPlaceholder("firstName")}
              />
              {tempFirstName && (
                <p className='text-xs text-muted-foreground'>
                  {isKannadaText(tempFirstName) ? "ಕನ್ನಡ" : "English"} script
                  detected
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='lastName'>{t("lastName")}</Label>
              <Input
                id='lastName'
                value={tempLastName}
                onChange={(e) => setTempLastName(e.target.value)}
                placeholder={getPlaceholder("lastName")}
              />
              {tempLastName && (
                <p className='text-xs text-muted-foreground'>
                  {isKannadaText(tempLastName) ? "ಕನ್ನಡ" : "English"} script
                  detected
                </p>
              )}
            </div>
            <div className='flex gap-2'>
              <Button onClick={handleSave} size='sm' disabled={isUpdating}>
                {isUpdating
                  ? tCommon("messages.saving")
                  : tCommon("buttons.save")}
              </Button>
              <Button
                variant='outline'
                onClick={handleCancel}
                size='sm'
                disabled={isUpdating}
              >
                {tCommon("buttons.cancel")}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
