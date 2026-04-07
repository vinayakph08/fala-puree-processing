"use client";

import { SubPageLayout } from "@/components/layout/subpage-layout";

export default function QualityCheckDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubPageLayout title="Edit Test" backHref="/quality-check">
      {children}
    </SubPageLayout>
  );
}
