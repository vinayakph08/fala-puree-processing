"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/providers/user-provider";

function FarmeInfo() {
  const { user, isLoading, error } = useUser();

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
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your profile details</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Add Farm ID and Farm Name  */}
        </CardContent>
      </Card>
    </div>
  );
}

export default FarmeInfo;
