"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PWASettingsOption } from "@/components/user/pwa/pwa-settings-option";
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

  return (
    <>
      {/* Desktop Page Header - only show on desktop since mobile has header in AppLayout */}
      <div className='items-center gap-3 min-w-0 flex-1 mb-6 hidden md:flex'>
        <div className='p-2 bg-gray-100 rounded-lg flex-shrink-0'>
          <SettingsIcon className='h-6 w-6 text-gray-600' />
        </div>
        <div className='min-w-0 flex-1'>
          <h1 className='text-xl font-bold text-gray-900 truncate'>
            Settings
          </h1>
          <p className='text-sm text-gray-600 truncate'>Manage your application settings</p>
        </div>
      </div>

      {/* Mobile Page Title - simple title for mobile since header exists */}
      <div className='md:hidden mb-6'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-gray-100 rounded-lg'>
            <SettingsIcon className='h-6 w-6 text-gray-600' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-900'>Settings</h1>
            <p className='text-sm text-gray-600'>Manage your application settings</p>
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
              App Installation
            </h2>
          </div>
          <PWASettingsOption />
        </div>

        {/* Language & Region Section */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Globe className='h-5 w-5 text-gray-600' />
            <h2 className='text-lg font-semibold text-gray-900'>
              Language & Region
            </h2>
          </div>

        </div>

        {/* Notifications Section */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Bell className='h-5 w-5 text-gray-600' />
            <h2 className='text-lg font-semibold text-gray-900'>
              Notifications
            </h2>
          </div>

          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base'>
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Manage which notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex items-center justify-between py-2'>
                <div>
                  <p className='font-medium text-sm'>
                    New Orders
                  </p>
                  <p className='text-xs text-gray-600'>
                    Manage notifications for new orders
                  </p>
                </div>
                <Badge variant='secondary'>Enabled</Badge>
              </div>

              <div className='flex items-center justify-between py-2'>
                <div>
                  <p className='font-medium text-sm'>
                    Tasks
                  </p>
                  <p className='text-xs text-gray-600'>
                    Manage notifications for tasks
                  </p>
                </div>
                <Badge variant='secondary'>Enabled</Badge>
              </div>

              <div className='flex items-center justify-between py-2'>
                <div>
                  <p className='font-medium text-sm'>
                    Earnings
                  </p>
                  <p className='text-xs text-gray-600'>
                    Manage notifications for earnings
                  </p>
                </div>
                <Badge variant='secondary'>Enabled</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account & Privacy Section */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Shield className='h-5 w-5 text-gray-600' />
            <h2 className='text-lg font-semibold text-gray-900'>
              Account & Privacy
            </h2>
          </div>

          <Card>
            <CardContent className='pt-6 space-y-4'>
              <div className='flex items-center justify-between py-2'>
                <div className='flex items-center gap-3'>
                  <User className='h-4 w-4 text-gray-600' />
                  <span className='font-medium text-sm'>
                    Profile
                  </span>
                </div>
                <Badge variant='outline'>Private</Badge>
              </div>

              <div className='flex items-center justify-between py-2'>
                <div className='flex items-center gap-3'>
                  <Shield className='h-4 w-4 text-gray-600' />
                  <span className='font-medium text-sm'>
                    Data & Security
                  </span>
                </div>
                <Badge variant='outline'>Secure</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help & Support Section */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <HelpCircle className='h-5 w-5 text-gray-600' />
            <h2 className='text-lg font-semibold text-gray-900'>
              Help & Support
            </h2>
          </div>

          <Card>
            <CardContent className='pt-6 space-y-3'>
              <button className='w-full flex items-center justify-between py-2 text-left hover:bg-gray-50 rounded'>
                <span className='font-medium text-sm'>
                  FAQ
                </span>
                <Badge variant='secondary'>Available</Badge>
              </button>

              <button className='w-full flex items-center justify-between py-2 text-left hover:bg-gray-50 rounded'>
                <span className='font-medium text-sm'>
                  Contact
                </span>
                <Badge variant='secondary'>Available</Badge>
              </button>

              <button className='w-full flex items-center justify-between py-2 text-left hover:bg-gray-50 rounded'>
                <span className='font-medium text-sm'>
                  Feedback
                </span>
                <Badge variant='secondary'>Available</Badge>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* App Info */}
        <Card className='bg-gray-50'>
          <CardContent className='pt-6'>
            <div className='text-center space-y-2'>
              <p className='text-sm font-medium text-gray-900'>
                Fala v1.0.0
              </p>
              <p className='text-xs text-gray-600'>Fala is a productivity app that helps you manage your tasks efficiently.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
