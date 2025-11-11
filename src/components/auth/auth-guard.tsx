"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromClientSide } from "@/lib/auth/get-user";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user, error } = await getUserFromClientSide();

        if (error || !user) {
          setIsAuthenticated(false);
          // Redirect to login if not authenticated
          router.replace("/login");
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
            <div className='mb-2'>
              <div className='flex items-center justify-center mb-4'>
                <img
                  src='/fala-images/fala-192.png'
                  alt='Fala Logo'
                  className='h-16 w-auto'
                />
              </div>
              <div className='text-2xl font-bold text-primary mb-2'>
                Fala Cloud Farming
              </div>
            </div>
          </div>
        </div>
      )
    );
  }

  // Show nothing while redirecting unauthenticated users
  if (!isAuthenticated) {
    return null;
  }

  // Render children only if authenticated
  return <>{children}</>;
};
