"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function OrdersPage() {
  const t = useTranslations("orders");

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>{t("title")}</h1>
        <p className='text-muted-foreground'>
          Manage your orders and deliveries
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("title")} Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the orders page. More content coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
