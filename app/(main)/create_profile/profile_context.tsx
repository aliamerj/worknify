"use client";
import React, { createContext, useContext, useState } from "react";

interface AdditionalForm {
  title: string;
  description: string;
}

export interface FormState {
  name: string;
  email: string;
  jobTitle: string;
  address: string;
  intro: string;
  gitHub?: string;
  linkedin?: string;
  phone?: string;
  sections: AdditionalForm[];
}

interface ProfileContextValue {
  profileData: FormState;
  updateProfileData: (newData: Partial<FormState>) => void;
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
}: {
  children: React.ReactNode;
  name: string;
  email: string;
}) => {
  const [profileData, setProfileData] = useState<FormState>({
    jobTitle: "",
    name: name,
    phone: "",
    address: "",
    email: email,
    gitHub: "",
    linkedin: "",
    sections: [],
    intro: "",
  });

  const updateProfileData = (newData: Partial<FormState>) => {
    setProfileData((prevData) => ({ ...prevData, ...newData }));
  };

  return (
    <ProfileDataContext.Provider value={{ profileData, updateProfileData }}>
      {children}
    </ProfileDataContext.Provider>
  );
};
