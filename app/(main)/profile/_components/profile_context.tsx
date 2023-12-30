"use client";
import _ from "lodash";
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
import { convertTimeToString } from "@/utils/helper_function";

type ProfileData = ProfileSchema & { edit: boolean; userId: string };
type OptionalProfileData = {
  [P in keyof ProfileData]?: ProfileData[P];
};
interface ProfileContextValue {
  profileData: ProfileData;
  updateProfileData: (newData: Partial<ProfileSchema>) => void;
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  triggerSubmit: () => void;
  formRef: React.Ref<HTMLButtonElement>;
  resetForm: () => void;
  profileId?: number;
  findDifferences: () => OptionalProfileData;
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
    console.log(allProfileData);
    const getSavedForm = serializeProfile(allProfileData, name, email, userId);
    setProfileData(getSavedForm);
    router.replace(AppRouter.createProfile);
  };

  function findDifferences(): OptionalProfileData {
    const source = serializeProfile(allProfileData, name, email, userId);
    const differences: any = {};

    Object.keys(source).forEach((key) => {
      const typedKey = key as keyof ProfileData;
      if (!_.isEqual(source[typedKey], profileData[typedKey])) {
        if (typedKey === "experiences" || typedKey === "educations") {
          const sourceInfo = source[typedKey];
          const profileInfo = profileData[typedKey];
          if (sourceInfo.length === profileInfo.length) {
            const differencesArray = profileInfo.filter((item, index) => {
              const startDate = convertTimeToString(item.timePeriod.startDate);
              const endDate = convertTimeToString(item.timePeriod.endDate);
              return (
                !_.isEqual(startDate, sourceInfo[index].timePeriod.startDate) ||
                !_.isEqual(endDate, sourceInfo[index].timePeriod.endDate)
              );
            });

            if (differencesArray.length > 0) {
              differences[typedKey] = differencesArray;
            }
          }
        } else {
          differences[typedKey] = _.cloneDeep(profileData[typedKey]);
        }
      }
    });

    return differences;
  }

  const profileId = allProfileData?.profile.id;

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
        profileId,
        findDifferences,
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
      timePeriod: {
        startDate: convertTimeToString(exp.startDate)!,
        endDate: convertTimeToString(exp.endDate),
      },
      description: exp.description ?? "",
    }));
    const educationsData: EducationSchema[] = educations.map((edu) => ({
      ...edu,
      timePeriod: {
        startDate: convertTimeToString(edu.startDate)!,
        endDate: convertTimeToString(edu.endDate),
      },
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
