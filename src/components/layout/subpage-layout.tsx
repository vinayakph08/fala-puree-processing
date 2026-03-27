import { DesktopSidebar } from "./desktop-sidebar";
import { MobileSubPageHeader } from "./headers/mobile-subpage-header";
import { PWAInstallBanner } from "../user/pwa/pwa-install-banner";

interface SubPageLayoutProps {
  children: React.ReactNode;
  title: string;
  actionButton?: React.ReactNode;
}

export function SubPageLayout({
  children,
  title,
  actionButton,
}: SubPageLayoutProps) {
  return (
    <div className='min-h-screen bg-background'>
      {/* Desktop Layout */}
      <div className='hidden md:flex h-screen bg-white'>
        <DesktopSidebar />
        <main className='flex-1 overflow-y-auto p-6'>{children}</main>
      </div>

      {/* Mobile Layout */}
      <div className='md:hidden h-screen flex flex-col'>
        <MobileSubPageHeader title={title} actionButton={actionButton} />
        <main className='flex-1 overflow-y-auto mt-20'>
          <PWAInstallBanner />
          <div className='p-4'>{children}</div>
        </main>
      </div>
    </div>
  );
}
