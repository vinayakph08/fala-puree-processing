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

export interface UserProfile {
  id: string;
  firstName: string; // Legacy field for backward compatibility
  lastName: string; // Legacy field for backward compatibility
  mobileNumber?: string;
  role?: "USER" | "ADMIN";
  farm: {
    farm_id: string;
    farmName: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface IUserFistLastname {
  firstName: string;
  lastName?: string; // lastName is optional
}

interface UserContextType {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  updateName: (firstName: string, lastName: string) => Promise<void>;
  updateTitle: (title: "sri" | "srimati") => Promise<void>;
  getDisplayName: (language: string) => string;
  getWelcomeMessage: (language: string) => string;
  getInitials: (user: IUserFistLastname) => string;
  isKannadaText: (text: string) => boolean;
  isLoading: boolean;
  error: Error | null;
  isUpdating: boolean;
  refetchProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Default user data (in production, this would come from API/database)
const defaultUser: UserProfile = {
  id: "1",
  firstName: "",
  lastName: "",
  farm: {
    farm_id: "",
    farmName: "",
    createdAt: "",
    updatedAt: "",
  },
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile>(defaultUser);

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
      setUserState(serverProfile);
      // Also save to localStorage for offline access
      localStorage.setItem(
        "fala-user-profile",
        JSON.stringify(serverProfile)
      );
    }
  }, [serverProfile]);

  // Load user data from localStorage on mount (for offline access)
  useEffect(() => {
    if (!serverProfile && !isLoading) {
      const savedUser = localStorage.getItem("fala-user-profile");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUserState(parsed);
        } catch (error) {
          console.error("Error parsing saved user profile:", error);
        }
      }
    }
  }, [serverProfile, isLoading]);

  const setUser = (newUser: UserProfile) => {
    setUserState(newUser);
    localStorage.setItem("fala-user-profile", JSON.stringify(newUser));
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
    };

    try {
      await updateProfile(updateData);
    } catch (error) {
      console.error("Failed to update name on server:", error);
      // Fallback to local update if server fails
      const updatedUser: UserProfile = {
        ...user,
        firstName: nameUpdate.firstName,
        lastName: nameUpdate.lastName,
      };
      setUser(updatedUser);
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
        firstName: user.firstName,
        lastName: user.lastName || "",
      };
    } else {
      return {
        firstName: user.firstName,
        lastName: user.lastName || "",
      };
    }
  };

  const getDisplayName = (language: string): string => {
    return formatDisplayName(
      {
        firstName: user.firstName,
        lastName: user.lastName,
      },
      language,
    );
  };

  // Update title function with server sync
  const updateTitle = async (): Promise<void> => {
    try {
      await updateProfile({});
    } catch (error) {
      console.error("Failed to update title on server:", error);
      // Fallback to local update if server fails
      const updatedUser: UserProfile = {
        ...user,
      };
      setUser(updatedUser);
      throw error; // Re-throw to let UI handle error
    }
  };

  const getInitials = (user: IUserFistLastname): string => {
    const { firstName, lastName } = user;
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
    <UserContext.Provider
      value={{
        user,
        setUser,
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
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
