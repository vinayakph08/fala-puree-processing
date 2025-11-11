"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAContextType {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  showInstallPrompt: () => Promise<void>;
  dismissInstallPrompt: () => void;
  resetDismissedStatus: () => void;
  installStatus:
    | "available"
    | "installing"
    | "installed"
    | "dismissed"
    | "not-available";
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export function PWAProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installStatus, setInstallStatus] =
    useState<PWAContextType["installStatus"]>("not-available");

  useEffect(() => {
    // Check if running on iOS
    const checkIOS = () => {
      return (
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as any).MSStream
      );
    };

    // Check if already installed
    const checkInstalled = () => {
      return (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes("android-app://")
      );
    };

    // Check if user previously dismissed
    const checkDismissed = () => {
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      return dismissed === "true";
    };

    setIsIOS(checkIOS());
    setIsInstalled(checkInstalled());

    if (checkInstalled()) {
      setInstallStatus("installed");
    } else if (checkDismissed()) {
      setInstallStatus("dismissed");
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);

      if (!checkDismissed() && !checkInstalled()) {
        setInstallStatus("available");
      }
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallStatus("installed");
      setDeferredPrompt(null);

      // Clear dismissed status
      localStorage.removeItem("pwa-install-dismissed");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const showInstallPrompt = async () => {
    if (!deferredPrompt) return;

    setInstallStatus("installing");

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setInstallStatus("installed");
        setIsInstalled(true);
      } else {
        setInstallStatus("dismissed");
        localStorage.setItem("pwa-install-dismissed", "true");
      }
    } catch (error) {
      console.error("Error showing install prompt:", error);
      setInstallStatus("available");
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const dismissInstallPrompt = () => {
    setInstallStatus("dismissed");
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  // New method to reset dismissed status
  const resetDismissedStatus = () => {
    localStorage.removeItem("pwa-install-dismissed");
    if (deferredPrompt || isIOS) {
      setInstallStatus("available");
    }
  };

  return (
    <PWAContext.Provider
      value={{
        isInstallable,
        isInstalled,
        isIOS,
        showInstallPrompt,
        dismissInstallPrompt,
        resetDismissedStatus,
        installStatus,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}

export function usePWA() {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error("usePWA must be used within a PWAProvider");
  }
  return context;
}
