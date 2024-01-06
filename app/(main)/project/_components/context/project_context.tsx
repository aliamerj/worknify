"use client";
import _ from "lodash";
import { AppRouter } from "@/utils/router/app_router";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { ProjectSchema } from "@/utils/validations/projectValidation";

type ProjectData = ProjectSchema & { edit: boolean };

interface ProjectContextValue {
  projectData: ProjectData;
  updateProjectData: (newData: Partial<ProjectSchema>) => void;
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  triggerSubmit: () => void;
  formRef: React.Ref<HTMLButtonElement>;
  resetForm: () => void;
}

const ProjectDataContext = createContext<ProjectContextValue | undefined>(
  undefined,
);

export const useProjectData = () => {
  const context = useContext(ProjectDataContext);
  if (context === undefined) {
    throw new Error("useProjectData must be used within a ProjectDataProvider");
  }
  return context;
};
export const ProjectDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const formRef = useRef<HTMLButtonElement>(null);
  var defaultProjectData: ProjectData = {
    owner: "",
    name: "",
    link: "",
    description: "",
    devs: [],
    type: "Public",
    timePeriod: {
      startDate: "",
      endDate: "",
    },
    compilation: 0,
    edit: false,
  };

  if (typeof window !== "undefined") {
    const savedData = localStorage?.getItem("formProject");
    defaultProjectData = savedData ? JSON.parse(savedData) : defaultProjectData;
  }

  const [projectData, setProjectData] =
    useState<ProjectData>(defaultProjectData);

  const updateProjectData = (newData: Partial<ProjectData>) => {
    setProjectData((prevData) => ({ ...prevData, ...newData }));
  };

  const setIsLoading = (state: boolean) => {
    setLoading(state);
  };
  const triggerSubmit = useCallback(() => {
    formRef.current?.click();
  }, []);

  useEffect(() => {
    localStorage.setItem("formProject", JSON.stringify(projectData));
  }, [projectData]);

  const resetForm = () => {
    setProjectData(defaultProjectData);
    router.replace(AppRouter.createProject);
  };

  return (
    <ProjectDataContext.Provider
      value={{
        projectData,
        updateProjectData,
        isLoading,
        setIsLoading,
        triggerSubmit,
        formRef,
        resetForm,
      }}
    >
      {children}
    </ProjectDataContext.Provider>
  );
};
