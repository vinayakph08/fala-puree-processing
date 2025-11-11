"use client";

import { Home, Archive, Calendar, Bell, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, labelKey: "Dashboard", href: "/dashboard" },
  // { icon: ClipboardList, labelKey: "navigation.orders", href: "/orders" },
  { icon: Sprout, labelKey: "Processing", href: "/puree-processing" },
  { icon: Calendar, labelKey: "Tasks", href: "/tasks" },
  { icon: Bell, labelKey: "Notifications", href: "/notifications" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className='fixed bottom-0 left-0 right-0 bg-background border-t z-50 md:hidden'>
      <div className='grid grid-cols-4 h-16'>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.href}
              variant='ghost'
              className={`flex flex-col items-center justify-center h-full gap-1 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              asChild
            >
              <Link href={item.href}>
                <item.icon className='w-8 h-8' />
                <span className='text-xs'>{item.labelKey}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
