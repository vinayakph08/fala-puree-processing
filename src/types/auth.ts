// Auth-related types for the Fala Farmer App

import { User } from "@supabase/supabase-js";

export interface UserSignUpData {
  first_name: string;
  last_name: string;
  role: "ADMIN" | "USER";
  phone_number: string;
  password: string;
  email?: string;
}

export interface UserProfile {
  id: string;
  title?: "sri" | "srimati";
  first_name: string;
  last_name?: string;
  mobile_number: string;
  email?: string;
  location?: string;
  address?: string;
  is_verified: boolean;
  is_active: boolean;
  language_preference: "kn" | "en" | "ta" | "ml" | "te" | "hi";
  role: "FARMER" | "CUSTOMER" | "ADMIN" | "USER";
  created_at: string;
  updated_at: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface SignUpResponse {
  success: boolean;
  user?: User | null;
  error?: AuthError;
}
