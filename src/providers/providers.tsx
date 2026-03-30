"use client";

import { QueryProvider } from "./query-provider";
import { ToastProvider } from "./toast-provider";
import { PWAProvider } from "./pwa-provider";
import { UserProvider } from "@/providers/user-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <PWAProvider>
        <UserProvider>
          <ToastProvider>{children}</ToastProvider>
        </UserProvider>
      </PWAProvider>
    </QueryProvider>
  );
}
