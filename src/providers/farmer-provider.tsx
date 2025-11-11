"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  isKannadaText,
  processNameInput,
  formatDisplayName,
} from "@/utils/language-utils";
import { useProfile } from "@/hooks/use-profile";

export interface FarmerProfile {
  id: string;
  firstName: string; // Legacy field for backward compatibility
  lastName: string; // Legacy field for backward compatibility
  firstNameKn?: string;
  lastNameKn?: string;
  firstNameEn?: string;
  lastNameEn?: string;
  mobileNumber?: string;
  primaryNameLanguage: "kn" | "en";
  title: "sri" | "srimati"; // ಶ್ರೀ or ಶ್ರೀಮತಿ
  language: "kn" | "en";
  farm: {
    farm_id: string;
    farmName: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface IFarmerFistLastname {
  firstName: string;
  lastName?: string; // lastName is optional
}

interface FarmerContextType {
  farmer: FarmerProfile;
  setFarmer: (farmer: FarmerProfile) => void;
  updateName: (firstName: string, lastName: string) => Promise<void>;
  updateTitle: (title: "sri" | "srimati") => Promise<void>;
  getDisplayName: (language: string) => string;
  getWelcomeMessage: (language: string) => string;
  getInitials: (farmer: IFarmerFistLastname) => string;
  isKannadaText: (text: string) => boolean;
  isLoading: boolean;
  error: Error | null;
  isUpdating: boolean;
  refetchProfile: () => void;
}

const FarmerContext = createContext<FarmerContextType | undefined>(undefined);

// Default farmer data (in production, this would come from API/database)
const defaultFarmer: FarmerProfile = {
  id: "1",
  firstName: "",
  lastName: "",
  firstNameKn: "",
  lastNameKn: "",
  firstNameEn: undefined,
  lastNameEn: undefined,
  primaryNameLanguage: "kn",
  title: "sri",
  language: "kn",
  farm: {
    farm_id: "",
    farmName: "",
    createdAt: "",
    updatedAt: "",
  },
};

export function FarmerProvider({ children }: { children: ReactNode }) {
  const [farmer, setFarmerState] = useState<FarmerProfile>(defaultFarmer);

  // Use server data hook
  const {
    profile: serverProfile,
    isLoading,
    error,
    updateProfile,
    isUpdating,
    refetch: refetchProfile,
  } = useProfile();

  // Sync server data with local state
  useEffect(() => {
    if (serverProfile) {
      setFarmerState(serverProfile);
      // Also save to localStorage for offline access
      localStorage.setItem(
        "fala-farmer-profile",
        JSON.stringify(serverProfile)
      );
    }
  }, [serverProfile]);

  // Load farmer data from localStorage on mount (for offline access)
  useEffect(() => {
    if (!serverProfile && !isLoading) {
      const savedFarmer = localStorage.getItem("fala-farmer-profile");
      if (savedFarmer) {
        try {
          const parsed = JSON.parse(savedFarmer);
          setFarmerState(parsed);
        } catch (error) {
          console.error("Error parsing saved farmer profile:", error);
        }
      }
    }
  }, [serverProfile, isLoading]);

  const setFarmer = (newFarmer: FarmerProfile) => {
    setFarmerState(newFarmer);
    localStorage.setItem("fala-farmer-profile", JSON.stringify(newFarmer));
  };

  // Smart name update function with server sync
  const updateName = async (
    firstName: string,
    lastName: string
  ): Promise<void> => {
    const nameUpdate = processNameInput(firstName, lastName);

    const updateData = {
      firstName: nameUpdate.firstName,
      lastName: nameUpdate.lastName,
      firstNameKn: nameUpdate.firstNameKn,
      lastNameKn: nameUpdate.lastNameKn,
      firstNameEn: nameUpdate.firstNameEn,
      lastNameEn: nameUpdate.lastNameEn,
      primaryNameLanguage: nameUpdate.detectedLanguage,
    };

    try {
      await updateProfile(updateData);
    } catch (error) {
      console.error("Failed to update name on server:", error);
      // Fallback to local update if server fails
      const updatedFarmer: FarmerProfile = {
        ...farmer,
        firstName: nameUpdate.firstName,
        lastName: nameUpdate.lastName,
        primaryNameLanguage: nameUpdate.detectedLanguage,
        firstNameKn: nameUpdate.firstNameKn || farmer.firstNameKn,
        lastNameKn: nameUpdate.lastNameKn || farmer.lastNameKn,
        firstNameEn: nameUpdate.firstNameEn || farmer.firstNameEn,
        lastNameEn: nameUpdate.lastNameEn || farmer.lastNameEn,
      };
      setFarmer(updatedFarmer);
      throw error; // Re-throw to let UI handle error
    }
  };

  // Utility function to detect if text is in Kannada script
  // const isKannadaText = (text: string): boolean => {
  //   return /[ಅ-ಹ]/.test(text);
  // };

  // Utility function to get name in preferred language
  const getNameInLanguage = (
    language: string
  ): { firstName: string; lastName: string } => {
    if (language === "kn") {
      return {
        firstName: farmer.firstNameKn || farmer.firstName,
        lastName: farmer.lastNameKn || farmer.lastName || "",
      };
    } else {
      return {
        firstName: farmer.firstNameEn || farmer.firstName,
        lastName: farmer.lastNameEn || farmer.lastName || "",
      };
    }
  };

  const getDisplayName = (language: string): string => {
    return formatDisplayName(
      {
        firstNameKn: farmer.firstNameKn,
        lastNameKn: farmer.lastNameKn,
        firstNameEn: farmer.firstNameEn,
        lastNameEn: farmer.lastNameEn,
        firstName: farmer.firstName,
        lastName: farmer.lastName,
      },
      language,
      farmer.title
    );
  };

  // Update title function with server sync
  const updateTitle = async (title: "sri" | "srimati"): Promise<void> => {
    try {
      await updateProfile({ title });
    } catch (error) {
      console.error("Failed to update title on server:", error);
      // Fallback to local update if server fails
      const updatedFarmer: FarmerProfile = {
        ...farmer,
        title,
      };
      setFarmer(updatedFarmer);
      throw error; // Re-throw to let UI handle error
    }
  };

  const getInitials = (farmer: IFarmerFistLastname): string => {
    const { firstName, lastName } = farmer;
    const _firstname = isKannadaText(firstName)
      ? firstName.slice(0, 2)
      : firstName[0];

    return `${_firstname}`.toUpperCase() || "";
  };

  const getWelcomeMessage = (language: string): string => {
    const name = getDisplayName(language);

    if (language === "kn") {
      return `ಸ್ವಾಗತ, ${name}`;
    } else {
      return `Welcome back, ${name}`;
    }
  };

  return (
    <FarmerContext.Provider
      value={{
        farmer,
        setFarmer,
        updateName,
        updateTitle,
        getDisplayName,
        getWelcomeMessage,
        getInitials,
        isKannadaText,
        isLoading,
        error,
        isUpdating,
        refetchProfile,
      }}
    >
      {children}
    </FarmerContext.Provider>
  );
}

export function useFarmer() {
  const context = useContext(FarmerContext);
  if (context === undefined) {
    throw new Error("useFarmer must be used within a FarmerProvider");
  }
  return context;
}
