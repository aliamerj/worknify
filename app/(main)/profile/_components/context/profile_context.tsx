"use client";
import _ from "lodash";
import {
  EducationSchema,
  ExperienceSchema,
  ProfileSchema,
} from "@/utils/validations/profileValidation";
import React, {
  createContext,
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { convertTimeToString } from "@/utils/helper_function";
import { profileDataReducer } from "./profile_data_reducer";
import {
  EducationSelection,
  ExperienceSelection,
  ProfileSelection,
  SectionSelection,
} from "@/db/schemes/profileSchema";

export type ProfileData = ProfileSchema & {
  edit: boolean;
  userId: string;
  profileId?: number;
};
type OptionalProfileData = {
  [P in keyof ProfileData]?: ProfileData[P];
};

export type AllProfileData = {
  profile: (ProfileSelection & ExtendedProfileSelection) | null;
  profileId: number | null;
};
type ExtendedProfileSelection = ProfileSelection & {
  experiences?: ExperienceSelection[];
  educations?: EducationSelection[];
  sections?: SectionSelection[];
};
export const ProfileDataContext = createContext<ProfileData | undefined>(
  undefined,
);

export const LoadingContext = createContext<boolean | undefined>(undefined);
export const SetLoadingContext = createContext<
  ((state: boolean) => void) | undefined
>(undefined);

export const ResetFormContext = createContext<(() => void) | undefined>(
  undefined,
);
export const ProfileIdContext = createContext<number | undefined>(undefined);
export const FindDifferencesContext = createContext<
  ((newData: ProfileData) => OptionalProfileData) | undefined
>(undefined);

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
  allProfileData?: AllProfileData;
}) => {
  const [isLoading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const defaultProfileData = useMemo(() => {
    const serializedData = serializeProfile(
      allProfileData,
      name,
      email,
      userId,
    );

    if (typeof window !== "undefined" && !serializedData.edit) {
      const savedData = localStorage?.getItem("formData");
      return savedData
        ? { ...serializedData, ...JSON.parse(savedData) }
        : serializedData;
    }
    return serializedData;
  }, []);

  const [profileData, dispatch] = useReducer(
    profileDataReducer,
    defaultProfileData,
  );

  const resetForm = useCallback(() => {
    dispatch({
      type: "RESET_FORM",
      defaultProfileData: serializeProfile(allProfileData, name, email, userId),
    });
    formRef.current?.click();
  }, [allProfileData, name, email, userId]);

  const setIsLoading = useCallback((state: boolean) => {
    setLoading(state);
  }, []);

  const findDifferences = (newData: ProfileData): OptionalProfileData => {
    const source = serializeProfile(allProfileData, name, email, userId);
    const differences: any = {};

    Object.keys(source).forEach((key) => {
      const typedKey = key as keyof ProfileData;
      if (!_.isEqual(source[typedKey], newData[typedKey])) {
        differences[typedKey] = _.cloneDeep(newData[typedKey]);
      }
    });

    return differences;
  };

  return (
    <SetLoadingContext.Provider value={setIsLoading}>
      <ResetFormContext.Provider value={resetForm}>
        <FindDifferencesContext.Provider value={findDifferences}>
          <LoadingContext.Provider value={isLoading}>
            <ProfileDataContext.Provider value={profileData}>
              {children}
            </ProfileDataContext.Provider>
          </LoadingContext.Provider>
        </FindDifferencesContext.Provider>
      </ResetFormContext.Provider>
    </SetLoadingContext.Provider>
  );
};

const serializeProfile = (
  allProfileData: AllProfileData | undefined,
  name: string,
  email: string,
  userId: string,
): ProfileData => {
  if (allProfileData?.profileId && allProfileData.profile) {
    const {
      id,
      jobTitle,
      sections,
      experiences,
      educations,
      phoneNumber,
      background,
      email,
      address,
      github,
      linkedin,
      skills,
    } = allProfileData.profile;
    const experiencesData: ExperienceSchema[] = !experiences
      ? []
      : experiences.map((exp) => ({
          ...exp,
          timePeriod: {
            startDate: convertTimeToString(exp.startDate)!,
            endDate: convertTimeToString(exp.endDate),
          },
          description: exp.description ?? "",
        }));
    const educationsData: EducationSchema[] = !educations
      ? []
      : educations.map((edu) => ({
          ...edu,
          timePeriod: {
            startDate: convertTimeToString(edu.startDate)!,
            endDate: convertTimeToString(edu.endDate),
          },
        }));
    return {
      jobTitle: jobTitle ?? "",
      fullName: name,
      phoneNumber: phoneNumber ?? "",
      email: email,
      address: address ?? "",
      github: github ?? "",
      linkedin: linkedin ?? "",
      background: background ?? "",
      sections: sections ?? [],
      skills: skills ?? "",
      experiences: experiencesData,
      educations: educationsData,
      edit: true,
      userId,
      profileId: id,
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
