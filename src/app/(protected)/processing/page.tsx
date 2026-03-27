"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function PuréeProcessingPage() {
  const t = useTranslations("orders");

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Purée Processing</h1>
        <p className='text-muted-foreground'>
          Manage your Purée processing tasks
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purée Processing Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the Purée processing page. More content coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
