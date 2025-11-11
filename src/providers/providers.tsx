"use client";

import { QueryProvider } from "./query-provider";
import { ToastProvider } from "./toast-provider";
import { PWAProvider } from "./pwa-provider";
import { FarmerProvider } from "@/providers/farmer-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <PWAProvider>
        <FarmerProvider>
          <ToastProvider>{children}</ToastProvider>
        </FarmerProvider>
      </PWAProvider>
    </QueryProvider>
  );
}
