"use client";
import _ from "lodash";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FeatureSelection } from "@/db/schemes/featureSchema";
import { ColumnId, TaskSelection } from "@/db/schemes/taskSchema";
import { ProjectSelection } from "@/db/schemes/projectSchema";
import { DevInfo } from "../[projectId]/page";
import { useFeatures } from "../hooks/useFeatures";
import { useTaskColumns } from "../hooks/useTasks";
import { FeatureSchema } from "@/utils/validations/featureValidation";
import { TaskSchema } from "@/utils/validations/taskValidation";

interface DashboardContextType {
  project: ProjectSelection;
  isOwner: boolean;
  devsInfo: DevInfo[];
  features: FeatureSelection[];
  tasks: TaskSelection[];
  taskColumn: Record<ColumnId, TaskSelection[]>;
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
const initialColumns: Record<ColumnId, TaskSelection[]> = {
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
    isOwner: boolean;
    devsInfo: DevInfo[];
    selectedFeatureId?: number;
    features: FeatureSelection[];
    tasks: TaskSelection[];
  };
}> = ({ children, initialData }) => {
  const { project, isOwner, devsInfo, features, tasks } = initialData;

  const [selectedFeatureToUpdate, setSelectedFeatureToUpdate] =
    useState<FeatureSchema | null>(null);
  const [selectedTaskToUpdate, setSelectedTaskToUpdate] =
    useState<TaskSchema | null>(null);
  // feature
  const {
    features: currentFeatures,
    pushFeature,
    removeFeature,
    updateFeature,
    updateFeatureOrder,
  } = useFeatures(features);
  // task
  const { taskColumn, pushTask, removeTask, updateTask, updateTaskOrder } =
    useTaskColumns(
      tasks.reduce(
        (acc, task) => ({
          ...acc,
          [task.status]: [...(acc[task.status] || []), task],
        }),
        initialColumns,
      ),
    );

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      project,
      isOwner,
      devsInfo,
      features: currentFeatures,
      tasks,
      taskColumn,
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
      devsInfo,
      currentFeatures,
      tasks,
      taskColumn,
      selectedFeatureToUpdate,
    ],
  );

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};
