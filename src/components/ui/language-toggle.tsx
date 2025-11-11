"use client";

import { useLocale } from "next-intl";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useLocaleContext } from "@/providers/locale-provider";
import { Switch } from "./switch";

export function LanguageToggle() {
  const locale = useLocale();
  const { changeLocale, isPending } = useLocaleContext();

  const handleLocaleChange = (newLocale: "kn" | "en") => {
    changeLocale(newLocale);
  };

  const toggleLanguage = (checked: boolean) => {
    const newLocale = checked ? "en" : "kn";
    // Set cookie for persistence
    changeLocale(newLocale);
  };

  // use shadcn Select Component
  return (
    <div>
      {/* <Select
        value={locale}
        onValueChange={handleLocaleChange}
        disabled={isPending}
      >
        <SelectTrigger>
          <SelectValue placeholder='Select a language' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='en'>English</SelectItem>
          <SelectItem value='kn'>ಕನ್ನಡ</SelectItem>
        </SelectContent>
      </Select> */}
      <div
        className='flex items-center gap-2 min-h-[44px] p-2 cursor-pointer'
        title='Switch Language'
      >
        {/* <Languages className='h-4 w-4' /> */}
        <span className='text-xs font-medium'>ಕ</span>
        <Switch
          checked={locale === "en"}
          onCheckedChange={toggleLanguage}
          className=''
        />
        <span className='text-xs font-medium'>En</span>
      </div>
    </div>
  );
}

export default LanguageToggle;
