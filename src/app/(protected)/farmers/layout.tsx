import { AppLayout } from "@/components/layout/app-layout";

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
