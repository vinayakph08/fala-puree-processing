"use client";

import { Toaster } from "@/components/ui/sonner";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position='top-right'
        richColors
        closeButton
        duration={4000}
        theme='light'
        // toastOptions={{
        //   style: {
        //     background: "white",
        //     color: "black",
        //     border: "1px solid #e5e7eb",
        //   },
        //   className: "",
        //   descriptionClassName: "",
        // }}
      />
    </>
  );
}
