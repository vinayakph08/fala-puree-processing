import { DesktopSidebar } from "./desktop-sidebar";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { MobileHeader } from "./mobile-header";
import { PWAInstallBanner } from "@/components/farmer/pwa/pwa-install-banner";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className='min-h-screen bg-background'>
      {/* Desktop Layout */}
      <div className='hidden md:flex'>
        <DesktopSidebar />
        <main className='flex-1 overflow-auto'>
          <PWAInstallBanner />
          <div className='p-6'>{children}</div>
        </main>
      </div>

      {/* Mobile Layout */}
      <div className='md:hidden'>
        <MobileHeader />
        <main className='pb-16 pt-20'>
          <PWAInstallBanner />
          <div className='p-4'>{children}</div>
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
