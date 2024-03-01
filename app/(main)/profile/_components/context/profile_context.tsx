"use client";
import _ from "lodash";
import { AllProfileData } from "@/utils/api_handler/profile_handler";
import {
  EducationSchema,
  ExperienceSchema,
  ProfileSchema,
} from "@/utils/validations/profileValidation";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { convertTimeToString } from "@/utils/helper_function";
import { profileDataReducer } from "./profile_data_reducer";

export type ProfileData = ProfileSchema & { edit: boolean; userId: string };
type OptionalProfileData = {
  [P in keyof ProfileData]?: ProfileData[P];
};
export const ProfileDataContext = createContext<ProfileData | undefined>(
  undefined,
);
export const UpdateProfileDataContext = createContext<
  ((newData: Partial<ProfileSchema>) => void) | undefined
>(undefined);
export const LoadingContext = createContext<boolean | undefined>(undefined);
export const SetLoadingContext = createContext<
  ((state: boolean) => void) | undefined
>(undefined);

export const ResetFormContext = createContext<(() => void) | undefined>(
  undefined,
);
export const ProfileIdContext = createContext<number | undefined>(undefined);
export const FindDifferencesContext = createContext<
  (() => OptionalProfileData) | undefined
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
  allProfileData: AllProfileData | null;
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
      return savedData ? JSON.parse(savedData) : serializedData;
    }
    return serializedData;
  }, [allProfileData, name, email, userId]);
  const [profileData, dispatch] = useReducer(
    profileDataReducer,
    defaultProfileData,
  );

  const updateProfileData = useCallback((newData: Partial<ProfileData>) => {
    dispatch({ type: "UPDATE_PROFILE_DATA", newData });
  }, []);

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

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(profileData));
  }, [profileData]);

  const findDifferences = useCallback((): OptionalProfileData => {
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
  }, [allProfileData, name, email, userId, profileData]);

  const profileId = allProfileData?.profile.id;

  return (
    <UpdateProfileDataContext.Provider value={updateProfileData}>
      <SetLoadingContext.Provider value={setIsLoading}>
        <ResetFormContext.Provider value={resetForm}>
          <FindDifferencesContext.Provider value={findDifferences}>
            <ProfileIdContext.Provider value={profileId}>
              <LoadingContext.Provider value={isLoading}>
                <ProfileDataContext.Provider value={profileData}>
                  {children}
                </ProfileDataContext.Provider>
              </LoadingContext.Provider>
            </ProfileIdContext.Provider>
          </FindDifferencesContext.Provider>
        </ResetFormContext.Provider>
      </SetLoadingContext.Provider>
    </UpdateProfileDataContext.Provider>
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
