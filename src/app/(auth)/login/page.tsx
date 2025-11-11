"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signInWithMobile } from "@/lib/auth";
import { FarmerRegistrationForm } from "@/app/(auth)/register/farmer/farmer-registration-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function AuthFormContent() {
  const [tab, setTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loginData, setLoginData] = useState({
    mobileNumber: "",
    password: "",
  });

  const t = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data, error } = await signInWithMobile(
        loginData.mobileNumber,
        loginData.password
      );
      if (error) {
        setError(error.message);
      } else {
        toast.success("Welcome back! Successfully signed in to your account.");
        // Redirect to the originally requested page or dashboard
        router.push(redirectTo);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegistrationSuccess = () => {
    toast.success(
      "Account created successfully! Welcome to the FALA community."
    );
    // Redirect to the originally requested page or dashboard
    router.push(redirectTo);
  };

  const handleRegistrationError = (errorMessage: string) => {
    toast.error("Registration failed" + ": " + errorMessage);
  };

  return (
    <div className='py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center bg-gray-50 min-h-screen'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1 text-center'>
          <CardTitle className='text-3xl font-bold text-primary flex justify-center items-center space-x-2 mt-4'>
            <Image
              src='/fala-images/fala-logo.png'
              alt='FALA Logo'
              width={70}
              height={70}
            />
          </CardTitle>
          <CardDescription className='text-lg'>
            {tab === "signin" ? t("auth.signin.title") : t("auth.signup.title")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex justify-center items-center'>
            <span className='text-sm'>
              {tab === "signin"
                ? t("auth.signin.footerText1")
                : t("auth.signup.footerText1")}
            </span>
            <span className='text-sm font-semibold text-primary pl-1'>
              {tab === "signin"
                ? t("auth.signin.footerText2")
                : t("auth.signup.footerText2")}
            </span>
          </div>
          <Tabs value={tab} onValueChange={setTab} className='mx-4 py-3'>
            <TabsList className='w-full mb-2 py-6'>
              <TabsTrigger
                value='signin'
                className={` py-5 flex-1 ${
                  tab === "signin"
                    ? "data-[state=active]:bg-primary data-[state=active]:text-white"
                    : "bg-gray-100 text-primary"
                } transition-colors`}
              >
                {t("auth.signin.submit")}
              </TabsTrigger>
              <TabsTrigger
                value='signup'
                className={`py-5 flex-1 ${
                  tab === "signup"
                    ? "data-[state=active]:bg-primary data-[state=active]:text-white"
                    : "bg-gray-100 text-primary"
                } transition-colors`}
              >
                {t("auth.signup.submit")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value='signin'>
              <form onSubmit={handleLoginSubmit}>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='mobileNumber'>
                      {t("auth.fields.phoneNumber")}
                    </Label>
                    <div className='flex'>
                      <div className='flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md'>
                        <span className='text-gray-500 text-sm'>+91</span>
                      </div>
                      <Input
                        id='mobileNumber'
                        name='mobileNumber'
                        type='tel'
                        placeholder={t("auth.placeholders.phoneNumber")}
                        value={loginData.mobileNumber}
                        onChange={handleLoginInputChange}
                        className='rounded-l-none min-h-[44px]'
                        required
                      />
                    </div>
                  </div>
                  <div className='space-y-2 mb-4'>
                    <Label htmlFor='password'>
                      {t("auth.fields.password")}
                    </Label>
                    <div className='relative'>
                      <Input
                        id='password'
                        name='password'
                        type={showPassword ? "text" : "password"}
                        placeholder={t("auth.placeholders.password")}
                        value={loginData.password}
                        onChange={handleLoginInputChange}
                        className='min-h-[44px]'
                        required
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </div>
                  {error && (
                    <div className='text-red-600 text-sm text-center bg-red-50 p-2 rounded mb-2'>
                      {error}
                    </div>
                  )}
                </CardContent>
                <CardFooter className='flex flex-col space-y-4'>
                  <Button
                    type='submit'
                    className='w-full bg-primary hover:bg-green-700 min-h-[44px]'
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        {t("messages.loading")}
                      </>
                    ) : (
                      t("auth.signin.submit")
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            <TabsContent value='signup'>
              <CardContent className='space-y-4'>
                <FarmerRegistrationForm
                  onSuccess={handleRegistrationSuccess}
                  onError={handleRegistrationError}
                />
              </CardContent>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <div className='flex justify-center items-center mt-16'>
        <span className='text-primary text-sm'>Fala Version 1.0.0</span>
      </div>
    </div>
  );
}

export default function AuthForm() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <div className='flex items-center space-x-2'>
            <Loader2 className='h-6 w-6 animate-spin' />
            <span>Loading...</span>
          </div>
        </div>
      }
    >
      <AuthFormContent />
    </Suspense>
  );
}
