"use client";

import { SubPageLayout } from "@/components/layout/subpage-layout";

export default function NewQualityTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubPageLayout title="Quality Test">{children}</SubPageLayout>
  );
}
