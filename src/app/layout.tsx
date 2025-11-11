import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/providers";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { LocaleProvider } from "@/providers/locale-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Admin App",
  description: "Admin dashboard for managing Purée processing.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LocaleProvider initialLocale={locale}>
            <Providers>{children}</Providers>
          </LocaleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
