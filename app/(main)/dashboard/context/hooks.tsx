import { useContext, useMemo } from "react";
import { FeatureSelection } from "@/db/schemes/featureSchema";
import { ColumnsTask } from "./tasks/reducer";
import {
  ContributorContext,
  FeatureInfoContext,
  FeatureToUpdateContext,
  ProjectInfoContext,
  PushFeatureContext,
  PushTaskContext,
  RemoveContributorContext,
  RemoveFeatureContext,
  RemoveTaskContext,
  ReorderFeatureContext,
  ReorderTaskContext,
  SetFeatureToUpdateContext,
  SetTasksToUpdateContext,
  TaskInfoContext,
  TaskToUpdateContext,
  UpdateFeatureContext,
  UpdateTaskContext,
} from "./dashboardContextDefinitions";

export const useUpdateFeatureOrder = () => {
  const context = useContext(ReorderFeatureContext);
  if (context === undefined) {
    throw new Error(
      "useUpdateFeatureOrder must be used within a dashboardProvider",
    );
  }
  return context;
};

export const useSetFeatureToUpdate = () => {
  const context = useContext(SetFeatureToUpdateContext);
  if (context === undefined) {
    throw new Error(
      "useSetSelectedTaskToUpdate must be used within a dashboardProvider",
    );
  }
  return context;
};

export const useFeatureToUpdate = () => {
  return useContext(FeatureToUpdateContext);
};
export const useUpdateFeature = () => {
  const context = useContext(UpdateFeatureContext);
  if (context === undefined) {
    throw new Error(
      "useSetSelectedTaskToUpdate must be used within a dashboardProvider",
    );
  }
  return context;
};

export const usePushFeature = () => {
  const context = useContext(PushFeatureContext);
  if (context === undefined) {
    throw new Error("usePushFeature must be used within a dashboardProvider");
  }
  return context;
};

export const useFeatureInfo = () => {
  const context = useContext(FeatureInfoContext);
  if (context === undefined) {
    throw new Error("useFeatureInfo must be used within a dashboardProvider");
  }
  return context;
};

export const useCurrentProject = () => {
  const context = useContext(ProjectInfoContext);
  if (context === undefined) {
    throw new Error(
      "useCurrentProject must be used within a dashboardProvider",
    );
  }
  return context;
};
export const useRemoveFeature = () => {
  const context = useContext(RemoveFeatureContext);
  if (context === undefined) {
    throw new Error("useRemoveFeature must be used within a dashboardProvider");
  }
  return context;
};
export const useRemoveContributor = () => {
  const context = useContext(RemoveContributorContext);
  if (context === undefined) {
    throw new Error("useRemoveFeature must be used within a dashboardProvider");
  }
  return context;
};
export const useContributorsInfo = () => {
  const context = useContext(ContributorContext);
  if (context === undefined) {
    throw new Error("useRemoveFeature must be used within a dashboardProvider");
  }
  return context;
};

/// TASKS
export const useTasksInfo = () => {
  const context = useContext(TaskInfoContext);
  if (context === undefined) {
    throw new Error("useTasksInfo must be used within a dashboardProvider");
  }
  return context;
};
export const useUpdateTaskOrder = () => {
  const context = useContext(ReorderTaskContext);
  if (context === undefined) {
    throw new Error("useTasksInfo must be used within a dashboardProvider");
  }
  return context;
};

export const useSetTasksToUpdate = () => {
  const context = useContext(SetTasksToUpdateContext);
  if (context === undefined) {
    throw new Error("useTasksInfo must be used within a dashboardProvider");
  }
  return context;
};
export const useTasksToUpdate = () => {
  return useContext(TaskToUpdateContext);
};
export const useUpdateTask = () => {
  const context = useContext(UpdateTaskContext);
  if (context === undefined) {
    throw new Error("useTaskToUpdate must be used within a dashboardProvider");
  }
  return context;
};
export const useRemoveTask = () => {
  const context = useContext(RemoveTaskContext);
  if (context === undefined) {
    throw new Error("useRemoveTask must be used within a dashboardProvider");
  }
  return context;
};

export const usePushTask = () => {
  const context = useContext(PushTaskContext);
  if (context === undefined) {
    throw new Error("useRemoveTask must be used within a dashboardProvider");
  }
  return context;
};
// task count
export function useTaskCount(tasks: ColumnsTask, feature: FeatureSelection) {
  return useMemo(() => {
    const taskStatuses: (keyof ColumnsTask)[] = [
      "New",
      "In Progress",
      "Ready to Test",
    ];
    let taskCount = 0;

    taskStatuses.forEach((status) => {
      taskCount += tasks[status].reduce(
        (count, task) => count + (task.featureId === feature.id ? 1 : 0),
        0,
      );
    });

    return taskCount;
  }, [tasks, feature]);
}
