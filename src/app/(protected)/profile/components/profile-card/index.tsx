"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";
import { UserIcon } from "lucide-react";
import { useLocaleContext } from "@/providers/locale-provider";
import { useUser } from "@/providers/user-provider";

export function UserProfileCard() {
  const {
    user,
    updateName,
    updateTitle,
    getDisplayName,
    isKannadaText,
    isLoading,
    error,
    isUpdating,
  } = useUser();
  const { currentLocale } = useLocaleContext();
  const [isEditing, setIsEditing] = useState(false);
  const [tempFirstName, setTempFirstName] = useState("");
  const [tempLastName, setTempLastName] = useState("");
  const [tempTitle, setTempTitle] = useState();

  // Initialize temp values when editing starts
  const handleEditStart = () => {
    // Get current name in the UI language
    const currentName = {
      first: user.firstName,
      last: user.lastName,
    };

    setTempFirstName(currentName.first);
    setTempLastName(currentName.last || "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateName(tempFirstName, tempLastName);
      await updateTitle(tempTitle);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
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
          <CardTitle className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-16" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-5 w-28" />
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
          <CardTitle className="text-red-600">Failed to load profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please try again later.
          </p>
          <Button className="mt-2" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex justify-start items-center gap-1">
            <div className="p-3 bg-primary/20 rounded-full">
              <UserIcon className="h-5 w-5 rounded-full" color={"#09ad8d"} />
            </div>
            <div className="flex flex-col justify-start gap-1">
              <div>User Info</div>
              <div className="font-light text-xs text-muted-foreground">
                User Description
              </div>
            </div>
          </div>
          {!isEditing && (
            <Button size="sm" onClick={handleEditStart}>
              Edit Profile
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditing ? (
          <>
            <div>
              <Label className="text-sm text-muted-foreground">
                Display Name
              </Label>
              <p className="font-medium">{getDisplayName(currentLocale)}</p>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">
                First Name
              </Label>
              <p className="font-medium">{user.firstName}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Last Name</Label>
              <p className="font-medium">{user.lastName}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Mobile Number
              </Label>
              <p className="font-medium">{user?.mobileNumber}</p>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={tempFirstName}
                onChange={(e) => setTempFirstName(e.target.value)}
                placeholder={getPlaceholder("firstName")}
              />
              {tempFirstName && (
                <p className="text-xs text-muted-foreground">
                  {isKannadaText(tempFirstName) ? "ಕನ್ನಡ" : "English"} script
                  detected
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={tempLastName}
                onChange={(e) => setTempLastName(e.target.value)}
                placeholder={getPlaceholder("lastName")}
              />
              {tempLastName && (
                <p className="text-xs text-muted-foreground">
                  {isKannadaText(tempLastName) ? "ಕನ್ನಡ" : "English"} script
                  detected
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                size="sm"
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
