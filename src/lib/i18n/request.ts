import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const store = await cookies();

  // Get locale from cookie with fallback to default
  let locale = store.get("locale")?.value || routing.defaultLocale;

  // Validate that the locale is supported
  if (!routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  try {
    return {
      locale,
      messages: {
        common: (await import(`../../../public/locales/${locale}/common.json`))
          .default,
        inventory: (
          await import(`../../../public/locales/${locale}/inventory.json`)
        ).default,
        orders: (await import(`../../../public/locales/${locale}/orders.json`))
          .default,
        dashboard: (
          await import(`../../../public/locales/${locale}/dashboard.json`)
        ).default,
        profile: (
          await import(`../../../public/locales/${locale}/profile.json`)
        ).default,
        tasks: (await import(`../../../public/locales/${locale}/tasks.json`))
          .default,
        settings: (
          await import(`../../../public/locales/${locale}/settings.json`)
        ).default,
      },
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    // Fallback to default locale if loading fails
    // return {
    //   locale: routing.defaultLocale,
    //   messages: {
    //     common: (
    //       await import(
    //         `../../../public/locales/${routing.defaultLocale}/common.json`
    //       )
    //     ).default,
    //     inventory: (
    //       await import(
    //         `../../../public/locales/${routing.defaultLocale}/inventory.json`
    //       )
    //     ).default,
    //     orders: (
    //       await import(
    //         `../../../public/locales/${routing.defaultLocale}/orders.json`
    //       )
    //     ).default,
    //     dashboard: (
    //       await import(
    //         `../../../public/locales/${routing.defaultLocale}/dashboard.json`
    //       )
    //     ).default,
    //     profile: (
    //       await import(
    //         `../../../public/locales/${routing.defaultLocale}/profile.json`
    //       )
    //     ).default,
    //   },
    // };
  }
});
