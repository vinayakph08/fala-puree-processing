"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { PWASettingsOption } from "@/components/farmer/pwa/pwa-settings-option";
import {
  Settings as SettingsIcon,
  Globe,
  Smartphone,
  Bell,
  Shield,
  HelpCircle,
  User,
} from "lucide-react";

export default function SettingsPage() {
  const t = useTranslations("settings");

  return (
    <>
      {/* Desktop Page Header - only show on desktop since mobile has header in AppLayout */}
      <div className='items-center gap-3 min-w-0 flex-1 mb-6 hidden md:flex'>
        <div className='p-2 bg-gray-100 rounded-lg flex-shrink-0'>
          <SettingsIcon className='h-6 w-6 text-gray-600' />
        </div>
        <div className='min-w-0 flex-1'>
          <h1 className='text-xl font-bold text-gray-900 truncate'>
            {t("title")}
          </h1>
          <p className='text-sm text-gray-600 truncate'>{t("description")}</p>
        </div>
      </div>

      {/* Mobile Page Title - simple title for mobile since header exists */}
      <div className='md:hidden mb-6'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-gray-100 rounded-lg'>
            <SettingsIcon className='h-6 w-6 text-gray-600' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-900'>{t("title")}</h1>
            <p className='text-sm text-gray-600'>{t("description")}</p>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className='space-y-6'>
        {/* App Installation Section */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Smartphone className='h-5 w-5 text-gray-600' />
            <h2 className='text-lg font-semibold text-gray-900'>
              {t("sections.app.title")}
            </h2>
          </div>
          <PWASettingsOption />
        </div>

        {/* Language & Region Section */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Globe className='h-5 w-5 text-gray-600' />
            <h2 className='text-lg font-semibold text-gray-900'>
              {t("sections.language.title")}
            </h2>
          </div>

          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base'>
                {t("sections.language.subtitle")}
              </CardTitle>
              <CardDescription>
                {t("sections.language.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>
                  {t("sections.language.current")}
                </span>
                <LanguageToggle />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications Section */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Bell className='h-5 w-5 text-gray-600' />
            <h2 className='text-lg font-semibold text-gray-900'>
              {t("sections.notifications.title")}
            </h2>
          </div>

          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base'>
                {t("sections.notifications.subtitle")}
              </CardTitle>
              <CardDescription>
                {t("sections.notifications.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex items-center justify-between py-2'>
                <div>
                  <p className='font-medium text-sm'>
                    {t("sections.notifications.orders")}
                  </p>
                  <p className='text-xs text-gray-600'>
                    {t("sections.notifications.ordersDesc")}
                  </p>
                </div>
                <Badge variant='secondary'>{t("common.enabled")}</Badge>
              </div>

              <div className='flex items-center justify-between py-2'>
                <div>
                  <p className='font-medium text-sm'>
                    {t("sections.notifications.tasks")}
                  </p>
                  <p className='text-xs text-gray-600'>
                    {t("sections.notifications.tasksDesc")}
                  </p>
                </div>
                <Badge variant='secondary'>{t("common.enabled")}</Badge>
              </div>

              <div className='flex items-center justify-between py-2'>
                <div>
                  <p className='font-medium text-sm'>
                    {t("sections.notifications.earnings")}
                  </p>
                  <p className='text-xs text-gray-600'>
                    {t("sections.notifications.earningsDesc")}
                  </p>
                </div>
                <Badge variant='secondary'>{t("common.enabled")}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account & Privacy Section */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Shield className='h-5 w-5 text-gray-600' />
            <h2 className='text-lg font-semibold text-gray-900'>
              {t("sections.privacy.title")}
            </h2>
          </div>

          <Card>
            <CardContent className='pt-6 space-y-4'>
              <div className='flex items-center justify-between py-2'>
                <div className='flex items-center gap-3'>
                  <User className='h-4 w-4 text-gray-600' />
                  <span className='font-medium text-sm'>
                    {t("sections.privacy.profile")}
                  </span>
                </div>
                <Badge variant='outline'>{t("common.private")}</Badge>
              </div>

              <div className='flex items-center justify-between py-2'>
                <div className='flex items-center gap-3'>
                  <Shield className='h-4 w-4 text-gray-600' />
                  <span className='font-medium text-sm'>
                    {t("sections.privacy.data")}
                  </span>
                </div>
                <Badge variant='outline'>{t("common.secure")}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help & Support Section */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <HelpCircle className='h-5 w-5 text-gray-600' />
            <h2 className='text-lg font-semibold text-gray-900'>
              {t("sections.help.title")}
            </h2>
          </div>

          <Card>
            <CardContent className='pt-6 space-y-3'>
              <button className='w-full flex items-center justify-between py-2 text-left hover:bg-gray-50 rounded'>
                <span className='font-medium text-sm'>
                  {t("sections.help.faq")}
                </span>
                <Badge variant='secondary'>{t("common.available")}</Badge>
              </button>

              <button className='w-full flex items-center justify-between py-2 text-left hover:bg-gray-50 rounded'>
                <span className='font-medium text-sm'>
                  {t("sections.help.contact")}
                </span>
                <Badge variant='secondary'>{t("common.available")}</Badge>
              </button>

              <button className='w-full flex items-center justify-between py-2 text-left hover:bg-gray-50 rounded'>
                <span className='font-medium text-sm'>
                  {t("sections.help.feedback")}
                </span>
                <Badge variant='secondary'>{t("common.available")}</Badge>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* App Info */}
        <Card className='bg-gray-50'>
          <CardContent className='pt-6'>
            <div className='text-center space-y-2'>
              <p className='text-sm font-medium text-gray-900'>
                {t("app.name")} v1.0.0
              </p>
              <p className='text-xs text-gray-600'>{t("app.description")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
