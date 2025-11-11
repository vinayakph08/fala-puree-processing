"use client";

import { LanguageToggle } from "@/components/ui/language-toggle";
import { useFarmer } from "@/providers/farmer-provider";
import { ProfileDropdown } from "@/components/user/profile-dropdown";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocaleContext } from "@/providers/locale-provider";

const navItems = [
  { icon: "🏠", label: "Dashboard", href: "/dashboard" },
  // { icon: "📋", label: "Orders", href: "/orders" },
  // { icon: "📦", label: "Inventory", href: "/inventory" },
  // { icon: "📅", label: "Tasks", href: "/tasks" },
  { icon: "👤", label: "Profile", href: "/profile" },
];

export function MobileHeader() {
  const t = useTranslations("common");
  const { currentLocale } = useLocaleContext();
  const { getDisplayName } = useFarmer();

  return (
    <header className='flex items-center justify-between gap-4 w-full p-4 border-b fixed md:hidden bg-background'>
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
        <LanguageToggle />
        {/* Profile dropdown for mobile - appears in top right */}
        <div className='lg:hidden'>
          <ProfileDropdown />
        </div>

        {/* Optional: Hamburger menu for additional options */}
        {/* <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Menu</h2>
              <nav className="space-y-4">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={item.href}>
                      <span className="text-lg">{item.icon}</span>
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet> */}
      </div>
    </header>
  );
}
