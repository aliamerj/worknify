import { createContext } from "react";
import { FeatureSelection } from "@/db/schemes/featureSchema";
import { ColumnId, TaskSelection } from "@/db/schemes/taskSchema";
import { ProjectSelection } from "@/db/schemes/projectSchema";
import { ColumnsTask } from "./tasks/reducer";
import { DevInfo } from "./dashboard_context";
import { FeatureSchema } from "@/utils/validations/featureValidation";
import { TaskSchema } from "@/utils/validations/taskValidation";

export interface IProjectInfoProvider {
  project: ProjectSelection;
  isDev?: string;
  isOwner?: string;
}

export const ProjectInfoContext = createContext<
  IProjectInfoProvider | undefined
>(undefined);
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
