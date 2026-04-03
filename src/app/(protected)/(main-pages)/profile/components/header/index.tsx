import { getTranslations } from "next-intl/server";
import React from "react";

async function ProfileHeader() {
  const t = await getTranslations("profile");
  return (
    <div>
      <h1 className='text-2xl font-bold'>{t("title")}</h1>
      <p className='text-muted-foreground'>{t("description")}</p>
    </div>
  );
}

export default ProfileHeader;
