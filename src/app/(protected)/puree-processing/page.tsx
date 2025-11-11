"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function PureeProcessingPage() {
  const t = useTranslations("orders");

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Puree Processing</h1>
        <p className='text-muted-foreground'>
          Manage your puree processing tasks
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Puree Processing Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the puree processing page. More content coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
