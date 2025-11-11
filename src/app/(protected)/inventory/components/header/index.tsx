"use client";

import React from "react";
import { useTranslations } from "next-intl";

function InventoryPageHeader() {
  const t = useTranslations("inventory");
  return (
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-2xl font-bold text-foreground'>{t("title")}</h1>
        <p className='text-muted-foreground'>{t("description")}</p>
      </div>
    </div>
  );
}

export default InventoryPageHeader;
