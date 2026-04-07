"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface MobileSubPageHeaderProps {
  title: string;
  backHref?: string;
  actionButton?: React.ReactNode;
}

export function MobileSubPageHeader({
  title,
  backHref,
  actionButton,
}: MobileSubPageHeaderProps) {
  const router = useRouter();

  return (
    <header className='flex items-center justify-between w-full p-4 border-b fixed md:hidden bg-background z-50'>
      <div className='flex items-center gap-3'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => backHref ? router.push(backHref) : router.back()}
          className='flex items-center gap-2 border text-slate-600 hover:text-slate-900 min-h-[44px] min-w-[44px]'
        >
          <ArrowLeft className='h-5 w-5' />
        </Button>
      </div>

      <div className='flex-1 text-center'>
        <h1 className='font-semibold text-lg truncate'>{title}</h1>
      </div>

      <div className='flex items-center'>{actionButton && actionButton}</div>
    </header>
  );
}
