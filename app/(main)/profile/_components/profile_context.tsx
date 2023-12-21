"use client";
import { ProfileSelection } from "@/db/schemes/profileSchema";
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

export const useProfileData = () => {
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
  profile,
}: {
  children: React.ReactNode;
  name: string;
  email: string;
  profile?: ProfileSelection | null;
}) => {
  const [isLoading, setLoading] = useState(false);
  const formRef = useRef<HTMLButtonElement>(null);

  var defaultProfileData: ProfileData = {
    jobTitle: profile?.jobTitle ?? "",
    fullName: name,
    phoneNumber: profile?.phoneNumber ?? "",
    email: email,
    address: profile?.address ?? "",
    github: profile?.github ?? "",
    linkedin: profile?.linkedin ?? "",
    background: profile?.background ?? "",
    sections: [],
    skills: profile?.skills ?? "",
    experiences: [],
    educations: [],
  };
  if (typeof window !== "undefined") {
    const savedData = localStorage?.getItem("formData");

    defaultProfileData = savedData ? JSON.parse(savedData) : defaultProfileData;
  }

  const [profileData, setProfileData] =
    useState<ProfileData>(defaultProfileData);

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
