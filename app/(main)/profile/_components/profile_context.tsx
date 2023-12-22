"use client";
import { AllProfileData } from "@/utils/api_handler/profile_handler";
import { AppRouter } from "@/utils/router/app_router";
import {
  EducationSchema,
  ExperienceSchema,
  ProfileSchema,
} from "@/utils/validations/profileValidation";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type ProfileData = ProfileSchema & { edit: boolean; userId: string };

interface ProfileContextValue {
  profileData: ProfileData;
  updateProfileData: (newData: Partial<ProfileSchema>) => void;
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  triggerSubmit: () => void;
  formRef: React.Ref<HTMLButtonElement>;
  resetForm: () => void;
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
  allProfileData,
  userId,
}: {
  children: React.ReactNode;
  name: string;
  email: string;
  userId: string;
  allProfileData: AllProfileData | null;
}) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const formRef = useRef<HTMLButtonElement>(null);
  var defaultProfileData = serializeProfile(
    allProfileData,
    name,
    email,
    userId,
  );

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

  const resetForm = () => {
    const getSavedForm = serializeProfile(allProfileData, name, email, userId);
    setProfileData(getSavedForm);
    router.replace(AppRouter.createProfile);
  };

  return (
    <ProfileDataContext.Provider
      value={{
        profileData,
        updateProfileData,
        isLoading,
        setIsLoading,
        triggerSubmit,
        formRef,
        resetForm,
      }}
    >
      {children}
    </ProfileDataContext.Provider>
  );
};

const serializeProfile = (
  allProfileData: AllProfileData | null,
  name: string,
  email: string,
  userId: string,
): ProfileData => {
  if (allProfileData) {
    const { profile, sections, experiences, educations } = allProfileData;
    const experiencesData: ExperienceSchema[] = experiences.map((exp) => ({
      ...exp,
      timePeriod: { startDate: exp.startDate, endDate: exp.endData },
      description: exp.description ?? "",
    }));
    const educationsData: EducationSchema[] = educations.map((edu) => ({
      ...edu,
      timePeriod: { startDate: edu.startDate, endDate: edu.endData },
    }));

    return {
      jobTitle: profile?.jobTitle ?? "",
      fullName: name,
      phoneNumber: profile?.phoneNumber ?? "",
      email: email,
      address: profile?.address ?? "",
      github: profile?.github ?? "",
      linkedin: profile?.linkedin ?? "",
      background: profile?.background ?? "",
      sections: sections,
      skills: profile?.skills ?? "",
      experiences: experiencesData,
      educations: educationsData,
      edit: true,
      userId,
    };
  }
  return {
    jobTitle: "",
    fullName: name,
    phoneNumber: "",
    email: email,
    address: "",
    github: "",
    linkedin: "",
    background: "",
    sections: [],
    skills: "",
    experiences: [],
    educations: [],
    edit: false,
    userId,
  };
};
