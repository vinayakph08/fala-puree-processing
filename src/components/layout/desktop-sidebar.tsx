"use client";

import { Home, User, Calendar, LanguagesIcon, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfileDropdown } from "@/components/user/profile-dropdown";
import { LanguageToggle } from "../ui/language-toggle";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Home, label: "Purée Processing", href: "/processing" },
  // { icon: User, label: "Farmers", href: "/farmers" },
  // { icon: Archive, label: "Inventory", href: "/inventory" },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className='hidden md:flex flex-col w-xs bg-card border-r h-screen sticky top-0'>
      {/* Logo/Brand */}
      <div className='p-6 border-b'>
        <div className='flex items-end gap-2'>
          <img
            src='/fala-images/fala-logo.png'
            alt='Fala'
            className='w-10 h-10 object-contain'
          />
          <div className='text-2xl font-bold text-primary'>
            Purée Intelligence
          </div>
        </div>
        <p className='text-sm text-zinc-500'>
          Data tracking and intelligence tool
        </p>
      </div>

      {/* Navigation Items */}
      <nav className='flex-1 p-4 space-y-2'>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.href}
              variant={isActive ? "default" : "ghost"}
              className='w-full justify-start gap-3'
              asChild
            >
              <Link href={item.href}>
                <item.icon className='w-5 h-5' />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* User Profile Dropdown */}
      <div className='p-4 border-t'>
        <div className='flex items-center ml-4'>
          <LanguagesIcon className='w-4 h-4 inline-block mr-1' />
          <LanguageToggle />
        </div>
        <ProfileDropdown />
      </div>
    </aside>
  );
}
