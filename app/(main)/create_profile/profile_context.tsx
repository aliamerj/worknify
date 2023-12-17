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

type SerializedProfileData = Omit<ProfileData, "experiences" | "educations"> & {
  experiences: Array<
    Omit<ProfileData["experiences"][number], "timePeriod"> & {
      timePeriod: {
        startDate: string;
        endDate?: string;
      };
    }
  >;
  education: Array<
    Omit<ProfileData["educations"][number], "timePeriod"> & {
      timePeriod: {
        startDate: string;
        endDate?: string;
      };
    }
  >;
};

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
}: {
  children: React.ReactNode;
  name: string;
  email: string;
}) => {
  const [isLoading, setLoading] = useState(false);
  const formRef = useRef<HTMLButtonElement>(null);

  var defaultProfileData: ProfileData = {
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
  };
  if (typeof window !== "undefined") {
    const savedData = localStorage?.getItem("formData");
    defaultProfileData = savedData
      ? deserializeProfileData(savedData)
      : defaultProfileData;
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
    localStorage.setItem("formData", serializeProfileData(profileData));
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

const serializeProfileData = (data: ProfileData): string => {
  const serializedData: SerializedProfileData = {
    ...data,
    experiences: data.experiences.map((exp) => ({
      ...exp,
      timePeriod: {
        startDate: exp.timePeriod.startDate.toISOString(),
        endDate: exp.timePeriod.endDate?.toISOString(),
      },
    })),
    education: data.educations.map((edu) => ({
      ...edu,
      timePeriod: {
        startDate: edu.timePeriod.startDate.toISOString(),
        endDate: edu.timePeriod.endDate?.toISOString(),
      },
    })),
  };
  return JSON.stringify(serializedData);
};

const deserializeProfileData = (dataString: string): ProfileData => {
  const serializedData: SerializedProfileData = JSON.parse(dataString);
  const deserializedData: ProfileData = {
    ...serializedData,
    experiences: serializedData.experiences.map((exp) => ({
      ...exp,
      timePeriod: {
        startDate: new Date(exp.timePeriod.startDate),
        endDate: exp.timePeriod.endDate
          ? new Date(exp.timePeriod.endDate)
          : undefined,
      },
    })),
    educations: serializedData.education.map((edu) => ({
      ...edu,
      timePeriod: {
        startDate: new Date(edu.timePeriod.startDate),
        endDate: edu.timePeriod.endDate
          ? new Date(edu.timePeriod.endDate)
          : undefined,
      },
    })),
  };
  return deserializedData;
};
