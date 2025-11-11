"use client";

import React, {
  createContext,
  useContext,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";

interface LocaleContextType {
  currentLocale: string;
  changeLocale: (newLocale: string) => Promise<void>;
  isPending: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: string;
}) {
  const [currentLocale, setCurrentLocale] = useState(initialLocale);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const changeLocale = async (newLocale: string) => {
    if (newLocale === currentLocale) return;

    startTransition(async () => {
      try {
        // Set the cookie on the client side
        document.cookie = `locale=${newLocale}; path=/; max-age=${
          365 * 24 * 60 * 60
        }; samesite=lax`;

        setCurrentLocale(newLocale);

        // Refresh the page to apply the new locale
        router.refresh();
      } catch (error) {
        console.error("Failed to change locale:", error);
      }
    });
  };

  return (
    <LocaleContext.Provider value={{ currentLocale, changeLocale, isPending }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocaleContext must be used within a LocaleProvider");
  }
  return context;
}
