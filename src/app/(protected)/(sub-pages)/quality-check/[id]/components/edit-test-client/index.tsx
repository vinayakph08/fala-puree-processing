"use client";

import { useQualityCheckDetail } from "../../hooks/use-quality-check-detail";
import { Skeleton } from "@/components/ui/skeleton";
import { EditTestForm } from "../edit-test-form";

export function EditTestClient({ id }: { id: string }) {
  const { test, isLoading, error } = useQualityCheckDetail(id);

  if (isLoading) {
    return (
      <div className="space-y-4 pt-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[72px] w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error || !test) {
    return (
      <p className="text-sm text-destructive pt-4">Failed to load quality test.</p>
    );
  }

  return <EditTestForm test={test} />;
}
