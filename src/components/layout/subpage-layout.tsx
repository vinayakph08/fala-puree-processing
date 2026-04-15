import { DesktopSidebar } from "./desktop-sidebar";
import { MobileSubPageHeader } from "./headers/mobile-subpage-header";
import { PWAInstallBanner } from "../user/pwa/pwa-install-banner";

interface SubPageLayoutProps {
  children: React.ReactNode;
  title: string;
  actionButton?: React.ReactNode;
  backHref?: string;
}

export function SubPageLayout({
  children,
  title,
  actionButton,
  backHref,
}: SubPageLayoutProps) {
  return (
    <div className="h-screen overflow-hidden bg-background">
      {/* Desktop Layout */}
      <div className="hidden md:flex h-full bg-white">
        <DesktopSidebar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden h-full flex flex-col">
        <MobileSubPageHeader
          title={title}
          actionButton={actionButton}
          backHref={backHref}
        />
        <main className="flex-1 mt-14 overflow-hidden flex flex-col">
          <PWAInstallBanner />
          <div className="flex-1 min-h-0 overflow-hidden p-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
