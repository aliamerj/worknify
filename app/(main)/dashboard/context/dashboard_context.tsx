"use client";
import _ from "lodash";
import React, {
  createContext,
  useCallback,
  useMemo,
  useReducer,
  useState,
} from "react";
import { FeatureSelection } from "@/db/schemes/featureSchema";
import { ColumnId, TaskSelection } from "@/db/schemes/taskSchema";
import { ProjectSelection } from "@/db/schemes/projectSchema";
import { ColumnsTask } from "../hooks/useTasks";
import { calculateProjectCompletion } from "@/utils/helper_function";
import { FeatureSchema } from "@/utils/validations/featureValidation";
import { TaskSchema } from "@/utils/validations/taskValidation";
import { featureReducer } from "./features/reducer";
import { taskReducer } from "./tasks/reducer";

export interface DevInfo {
  id: string;
  image: string | null;
  name: string | null;
  email: string;
}
export interface FeatureQuery extends FeatureSelection {
  tasks: TaskSelection[];
}
interface Project extends ProjectSelection {
  features: FeatureQuery[];
  devs: Array<{
    contributor: DevInfo;
  }>;
}
interface IProjectInfoProvider {
  project: ProjectSelection;
  isDev?: string;
  isOwner?: string;
  getCompilation: () => number;
  getTaskCount: (featureId: number) => number;
  getHighestOrder: () => number;
}
const ProjectInfoContext = createContext<IProjectInfoProvider | undefined>(
  undefined,
);
export const FeatureInfoContext = createContext<FeatureSelection[] | undefined>(
  undefined,
);

export const PushFeatureContext = createContext<
  ((feature: FeatureSelection) => void) | undefined
>(undefined);
export const RemoveFeatureContext = createContext<
  ((featureId: number) => void) | undefined
>(undefined);
export const UpdateFeatureContext = createContext<
  ((feature: FeatureSelection) => void) | undefined
>(undefined);

export const ReorderFeatureContext = createContext<
  ((features: FeatureSelection[]) => void) | undefined
>(undefined);

const initialColumns: ColumnsTask = {
  New: [],
  "In Progress": [],
  "Ready to Test": [],
  Done: [],
};

export const TaskInfoContext = createContext<ColumnsTask | undefined>(
  undefined,
);
export const PushTaskContext = createContext<
  ((task: TaskSelection) => void) | undefined
>(undefined);
export const RemoveTaskContext = createContext<
  ((id: number, columnId: ColumnId) => void) | undefined
>(undefined);
export const UpdateTaskContext = createContext<
  ((task: TaskSelection) => void) | undefined
>(undefined);

export const ReorderTaskContext = createContext<
  ((columns: ColumnsTask) => void) | undefined
>(undefined);
export const ContributorContext = createContext<DevInfo[] | undefined>(
  undefined,
);
export const RemoveContributorContext = createContext<
  ((id: string) => void) | undefined
>(undefined);

export const FeatureToUpdateContext = createContext<FeatureSchema | undefined>(
  undefined,
);
export const TaskToUpdateContext = createContext<TaskSchema | undefined>(
  undefined,
);

export const SetFeatureToUpdateContext = createContext<
  ((feature?: FeatureSchema) => void) | undefined
>(undefined);

export const SetTasksToUpdateContext = createContext<
  ((task?: TaskSchema) => void) | undefined
>(undefined);

export const DashboardProvider: React.FC<{
  children: React.ReactNode;
  project: Project;
  isOwner?: string;
  isDev?: string;
  selectedFeatureId: number;
}> = ({
  children,
  project: initialData,
  selectedFeatureId,
  isDev,
  isOwner,
}) => {
  // project
  const { project, features, tasks, devs } =
    useTransformedProjectData(initialData);

  const getTaskCount = useCallback(
    (featureId: number) =>
      tasks[selectedFeatureId].filter(
        (t) => t.featureId === featureId && t.status !== "Done",
      ).length,
    [tasks],
  );
  const getCompilation = useCallback(
    () => calculateProjectCompletion(initialData.features),
    [features],
  );
  const getHighestOrder = useCallback(
    () =>
      tasks[selectedFeatureId].reduce(
        (max, task) => Math.max(max, task.order),
        0,
      ),
    [tasks[selectedFeatureId]],
  );

  const projectValue = useMemo(
    () => ({
      project,
      isOwner,
      isDev,
      getCompilation,
      getHighestOrder,
      getTaskCount,
    }),
    [project.id],
  );
  // features
  const [updatedFeatures, dispatchFeature] = useReducer(
    featureReducer,
    features,
  );

  const pushFeature = useCallback((feature: FeatureSelection) => {
    dispatchFeature({ type: "PUSH_FEATURE", payload: feature });
  }, []);

  const removeFeature = useCallback((id: number) => {
    dispatchFeature({ type: "REMOVE_FEATURE", payload: id });
  }, []);

  const updateFeature = useCallback((updatedFeature: FeatureSelection) => {
    dispatchFeature({ type: "UPDATE_FEATURE", payload: updatedFeature });
  }, []);

  const updateFeatureOrder = useCallback((newFeatures: FeatureSelection[]) => {
    dispatchFeature({ type: "UPDATE_FEATURE_ORDER", payload: newFeatures });
  }, []);

  // TASKS

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
  const [updatedTasks, dispatchTask] = useReducer(
    taskReducer,
    getColumns(tasks[selectedFeatureId], initialColumns),
  );

  const pushTask = useCallback((task: TaskSelection) => {
    dispatchTask({ type: "PUSH_TASK", payload: task });
  }, []);

  const removeTask = useCallback((id: number, columnId: ColumnId) => {
    dispatchTask({ type: "REMOVE_TASK", payload: { id, columnId } });
  }, []);

  const updateTask = useCallback((task: TaskSelection) => {
    dispatchTask({ type: "UPDATE_TASK", payload: task });
  }, []);

  const updateTaskOrder = useCallback((columns: ColumnsTask) => {
    dispatchTask({ type: "UPDATE_TASK_ORDER", payload: columns });
  }, []);
  // contributors
  const [contributors, setContributos] = useState(devs);
  const removeContributor = useCallback(
    (contributorId: string) => {
      setContributos((c) => c.filter((con) => con.id !== contributorId));
    },
    [contributors],
  );

  // utils
  const [featureToUpdate, setFeatureToUpdate] = useState<
    FeatureSchema | undefined
  >();
  const [taskToUpdate, setTaskToUpdate] = useState<TaskSchema | undefined>();

  const setSelectedTaskToUpdate = useCallback(
    (task?: TaskSchema) => setTaskToUpdate(task),
    [taskToUpdate],
  );

  const setSelectedFeatureToUpdate = useCallback(
    (feature?: FeatureSchema) => setFeatureToUpdate(feature),
    [featureToUpdate],
  );

  return (
    <ProjectInfoContext.Provider value={projectValue}>
      <RemoveContributorContext.Provider value={removeContributor}>
        <PushFeatureContext.Provider value={pushFeature}>
          <PushTaskContext.Provider value={pushTask}>
            <RemoveFeatureContext.Provider value={removeFeature}>
              <RemoveTaskContext.Provider value={removeTask}>
                <UpdateFeatureContext.Provider value={updateFeature}>
                  <SetFeatureToUpdateContext.Provider
                    value={setSelectedFeatureToUpdate}
                  >
                    {" "}
                    <UpdateTaskContext.Provider value={updateTask}>
                      <SetTasksToUpdateContext.Provider
                        value={setSelectedTaskToUpdate}
                      >
                        <ReorderFeatureContext.Provider
                          value={updateFeatureOrder}
                        >
                          <ReorderTaskContext.Provider value={updateTaskOrder}>
                            <ContributorContext.Provider value={contributors}>
                              <FeatureInfoContext.Provider
                                value={updatedFeatures}
                              >
                                <FeatureToUpdateContext.Provider
                                  value={featureToUpdate}
                                >
                                  <TaskInfoContext.Provider
                                    value={updatedTasks}
                                  >
                                    <TaskToUpdateContext.Provider
                                      value={taskToUpdate}
                                    >
                                      {children}
                                    </TaskToUpdateContext.Provider>
                                  </TaskInfoContext.Provider>
                                </FeatureToUpdateContext.Provider>
                              </FeatureInfoContext.Provider>
                            </ContributorContext.Provider>
                          </ReorderTaskContext.Provider>
                        </ReorderFeatureContext.Provider>
                      </SetTasksToUpdateContext.Provider>
                    </UpdateTaskContext.Provider>
                  </SetFeatureToUpdateContext.Provider>
                </UpdateFeatureContext.Provider>
              </RemoveTaskContext.Provider>
            </RemoveFeatureContext.Provider>
          </PushTaskContext.Provider>
        </PushFeatureContext.Provider>
      </RemoveContributorContext.Provider>
    </ProjectInfoContext.Provider>
  );
};

interface InitialValues {
  project: Omit<Project, "features" | "devs">;
  features: FeatureSelection[];
  tasks: Record<string, TaskSelection[]>; // key is the feature ID
  devs: Array<{
    id: string;
    image: string | null;
    email: string;
    name: string | null;
  }>;
}

const useTransformedProjectData = (projectData: Project): InitialValues => {
  // Memoize project information to avoid unnecessary recalculations
  const projectInfo = useMemo(() => {
    const { features, devs, ...rest } = projectData;
    return rest;
  }, [projectData]);

  // Memoize features without tasks
  const features = useMemo(
    () => projectData.features.map(({ tasks, ...rest }) => rest),
    [projectData.features],
  );

  // Memoize tasks, keyed by their feature ID
  const tasks = useMemo(
    () =>
      projectData.features.reduce(
        (acc, feature) => {
          acc[feature.id] = feature.tasks;
          return acc;
        },
        {} as Record<string, TaskSelection[]>,
      ),
    [projectData.features],
  );

  // Memoize transformed developers data
  const devs = useMemo(
    () =>
      projectData.devs.map(({ contributor }) => ({
        id: contributor.id,
        image: contributor.image,
        email: contributor.email,
        name: contributor.name,
      })),
    [projectData.devs],
  );

  return { project: projectInfo, features, tasks, devs };
};
