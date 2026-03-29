"use client";

import {
  Home,
  ClipboardList,
  Archive,
  Calendar,
  Bell,
  TrophyIcon,
  ShieldCheck,
  Factory,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, labelKey: "Dashboard", href: "/dashboard" },
  { icon: Factory, labelKey: "Processing", href: "/processing" },
  { icon: ShieldCheck, labelKey: "Quality Check", href: "/quality-check" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className='fixed bottom-0 left-0 right-0 bg-background border-t z-50 md:hidden'>
      <div className='grid grid-cols-3 h-16'>
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
