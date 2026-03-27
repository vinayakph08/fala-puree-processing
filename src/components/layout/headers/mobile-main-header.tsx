"use client";

import { LanguageToggle } from "@/components/ui/language-toggle";
import { useFarmer } from "@/providers/farmer-provider";
import { ProfileDropdown } from "@/components/user/profile-dropdown";
import { useTranslations } from "next-intl";
import { useLocaleContext } from "@/providers/locale-provider";

export function MobileMainHeader() {
  const t = useTranslations("common");
  const { currentLocale } = useLocaleContext();
  const { getDisplayName } = useFarmer();

  return (
    <header className='flex items-center justify-between gap-4 w-full p-4 border-b fixed md:hidden bg-background z-50'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <img
            src='/fala-images/fala-logo.png'
            alt='Fala'
            className='w-10 h-10 object-contain'
          />
        </div>

        <div>
          <p className='text-xs text-muted-foreground'>
            {t("messages.welcome")}
          </p>
          <h1 className='font-semibold'>{getDisplayName(currentLocale)}</h1>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        {/* <LanguageToggle /> */}
        <div className='lg:hidden'>
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
