import { DesktopSidebar } from "./desktop-sidebar";
import { MobileMainHeader } from "./headers/mobile-main-header";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { PWAInstallBanner } from "../user/pwa/pwa-install-banner";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-screen overflow-hidden bg-background">
      {/* Desktop Layout */}
      <div className="hidden md:flex h-full bg-white">
        <DesktopSidebar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden h-full flex flex-col">
        <MobileMainHeader />
        <main className="flex-1 mt-14 overflow-hidden flex flex-col">
          <PWAInstallBanner />
          <div className="flex-1 min-h-0 overflow-hidden p-4 pb-20">
            {children}
          </div>
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
