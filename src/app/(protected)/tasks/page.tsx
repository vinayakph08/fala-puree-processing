import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function TasksPage() {
  const t = await getTranslations("tasks");
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>{t("tasks.title")}</h1>
        <p className='text-muted-foreground'>{t("tasks.description")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("tasksCard.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t("tasksCard.description")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
