import { defineRouting } from "next-intl/routing";
import { Pathnames } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["kn", "en"],

  // Used when no locale matches
  defaultLocale: "kn",

  // Since you don't want locale-based routing, don't use locale prefix
  localePrefix: "never",
});

export const defaultLocale = "kn" as const;
export const locales = ["kn", "en"] as const;

export const pathnames: Pathnames<typeof locales> = {
  "/": "/",
  "/dashboard": "/dashboard",
  "/inventory": "/inventory",
  "/orders": "/orders",
  "/profile": "/profile",
  "/earning": "/earning",
  "/tasks": "/tasks",
  "/notifications": "/notifications",
};
