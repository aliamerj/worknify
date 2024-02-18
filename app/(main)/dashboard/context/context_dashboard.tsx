"use client";
import _ from "lodash";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { FeatureSelection } from "@/db/schemes/featureSchema";
import { ColumnId, TaskSelection } from "@/db/schemes/taskSchema";
import { ProjectSelection } from "@/db/schemes/projectSchema";
import { DevInfo } from "../[projectId]/page";
import { useFeatures } from "../hooks/useFeatures";
import { ColumnsTask, useTaskColumns } from "../hooks/useTasks";
import { FeatureSchema } from "@/utils/validations/featureValidation";
import { TaskSchema } from "@/utils/validations/taskValidation";

interface DashboardContextType {
  project: ProjectSelection;
  isOwner: string | null;
  isDev?: string;
  contributors: DevInfo[];
  features: FeatureSelection[];
  tasks: TaskSelection[];
  taskColumn: Record<ColumnId, TaskSelection[]>;
  updateContributors: (devs: DevInfo[]) => void;
  selectedFeatureToUpdate: FeatureSchema | null;
  setSelectedFeatureToUpdate: (feature: FeatureSchema | null) => void;
  selectedTaskToUpdate: TaskSchema | null;
  setSelectedTaskToUpdate: (task: TaskSchema | null) => void;
  featureActions: {
    pushFeature: (feature: FeatureSelection) => void;
    removeFeature: (id: number) => void;
    updateFeature: (newFeatureData: FeatureSelection) => void;
    updateFeatureOrder: (newFeatures: FeatureSelection[]) => void;
  };
  taskActions: {
    pushTask: (task: TaskSelection) => void;
    removeTask: (id: number, columnId: ColumnId) => void;
    updateTask: (newTaskData: TaskSelection) => void;
    updateTaskOrder: (newTasks: Record<ColumnId, TaskSelection[]>) => void;
  };
}
const initialColumns: ColumnsTask = {
  New: [],
  "In Progress": [],
  "Ready to Test": [],
  Done: [],
};
const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export const useDashboardContext = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider",
    );
  }
  return context;
};

export const DashboardProvider: React.FC<{
  children: React.ReactNode;
  initialData: {
    project: ProjectSelection;
    isOwner: string | null;
    isDev?: string;
    devsInfo: DevInfo[];
    selectedFeatureId?: number;
    features: FeatureSelection[];
    tasks: TaskSelection[];
  };
}> = ({ children, initialData }) => {
  const { project, isOwner, devsInfo, features, tasks, isDev } = initialData;
  const [selectedFeatureToUpdate, setSelectedFeatureToUpdate] =
    useState<FeatureSchema | null>(null);
  const [selectedTaskToUpdate, setSelectedTaskToUpdate] =
    useState<TaskSchema | null>(null);
  const [contributors, setContributors] = useState<DevInfo[]>(devsInfo);
  const updateContributors = useCallback(
    (devs: DevInfo[]) => setContributors(devs),
    [devsInfo],
  );
  // feature
  const {
    features: currentFeatures,
    pushFeature,
    removeFeature,
    updateFeature,
    updateFeatureOrder,
  } = useFeatures(features);
  // task
  const getColumns = useCallback(
    (tasks: TaskSelection[], initialColumns: ColumnsTask) => {
      return tasks.reduce((acc, task) => {
        const isTaskExist = acc[task.status]?.some(
          (existingTask) => existingTask.id === task.id,
        );
        if (!isTaskExist) {
          acc[task.status] = acc[task.status]
            ? [...acc[task.status], task]
            : [task];
        }

        return acc;
      }, initialColumns);
    },
    [initialColumns], // Assuming initialColumns is stable and doesn't change often
  );
  const { taskColumn, pushTask, removeTask, updateTask, updateTaskOrder } =
    useTaskColumns(getColumns(tasks, initialColumns));

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      project,
      isOwner,
      isDev,
      contributors,
      updateContributors,
      features: currentFeatures,
      tasks,
      taskColumn: getColumns(tasks, taskColumn),
      featureActions: {
        pushFeature,
        removeFeature,
        updateFeature,
        updateFeatureOrder,
      },
      taskActions: {
        pushTask,
        removeTask,
        updateTask,
        updateTaskOrder,
      },
      selectedFeatureToUpdate,
      setSelectedFeatureToUpdate,
      setSelectedTaskToUpdate,
      selectedTaskToUpdate,
    }),
    [
      project,
      isOwner,
      currentFeatures,
      tasks,
      updateContributors,
      taskColumn,
      selectedFeatureToUpdate,
      selectedTaskToUpdate,
      contributors,
    ],
  );

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};
