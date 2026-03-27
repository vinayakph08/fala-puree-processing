"use client";

import {
  Home,
  ClipboardList,
  Archive,
  Calendar,
  Bell,
  TrophyIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfileDropdown } from "@/components/user/profile-dropdown";

const navItems = [
  // { icon: Home, label: "Dashboard", href: "/dashboard" },
  // { icon: ClipboardList, label: "Orders", href: "/orders" },
  { icon: Archive, label: "Inventory", href: "/inventory" },
  { icon: Calendar, label: "Tasks", href: "/tasks" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: TrophyIcon, label: "Earnings", href: "/earnings" },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className='hidden md:flex flex-col w-64 bg-card border-r h-screen sticky top-0'>
      {/* Logo/Brand */}
      <div className='p-6 border-b'>
        <h1 className='text-xl font-bold text-primary'>Fala</h1>
        <p className='text-sm text-muted-foreground'>Farm Management</p>
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
        <ProfileDropdown />
      </div>
    </aside>
  );
}
