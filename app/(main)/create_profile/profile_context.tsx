"use client";
import { profileSchemaValidation } from "@/utils/validations/profileValidation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { z } from "zod";

export type ProfileData = z.infer<typeof profileSchemaValidation>;

interface ProfileContextValue {
  profileData: ProfileData;
  updateProfileData: (newData: Partial<ProfileData>) => void;
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  triggerSubmit: () => void;
  formRef: React.Ref<HTMLButtonElement>;
}

const ProfileDataContext = createContext<ProfileContextValue | undefined>(
  undefined,
);

export const useProfile = () => {
  const context = useContext(ProfileDataContext);
  if (context === undefined) {
    throw new Error("useProfileData must be used within a ProfileDataProvider");
  }
  return context;
};

export const ProfileDataProvider = ({
  children,
  name,
  email,
}: {
  children: React.ReactNode;
  name: string;
  email: string;
}) => {
  const [isLoading, setLoading] = useState(false);
  const formRef = useRef<HTMLButtonElement>(null);
  const savedData = localStorage?.getItem("formData");
  const initialProfileData = savedData
    ? JSON.parse(savedData)
    : {
        jobTitle: "",
        fullName: name,
        phoneNumber: "",
        address: "",
        email: email,
        github: "",
        linkedin: "",
        sections: [],
        background: "",
      };

  const [profileData, setProfileData] =
    useState<ProfileData>(initialProfileData);

  const updateProfileData = (newData: Partial<ProfileData>) => {
    setProfileData((prevData) => ({ ...prevData, ...newData }));
  };

  const setIsLoading = (state: boolean) => {
    setLoading(state);
  };
  const triggerSubmit = useCallback(() => {
    formRef.current?.click();
  }, []);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(profileData));
  }, [profileData]);

  return (
    <ProfileDataContext.Provider
      value={{
        profileData,
        updateProfileData,
        isLoading,
        setIsLoading,
        triggerSubmit,
        formRef,
      }}
    >
      {children}
    </ProfileDataContext.Provider>
  );
};
