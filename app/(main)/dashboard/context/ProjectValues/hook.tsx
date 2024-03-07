import { useMemo } from "react";
import { ProjectQuery } from "../dashboard_context";
import { FeatureSelection } from "@/db/schemes/featureSchema";
import { TaskSelection } from "@/db/schemes/taskSchema";

interface InitialValues {
  project: Omit<ProjectQuery, "features" | "devs">;
  features: FeatureSelection[];
  tasks: TaskSelection[]; // key is the feature ID
  devs: Array<{
    id: string;
    image: string | null;
    email: string;
    name: string | null;
  }>;
}

export const useProjectValue = (projectData: ProjectQuery): InitialValues => {
  // Memoize project information to avoid unnecessary recalculations
  const projectInfo = useMemo(() => {
    const { features, devs, ...rest } = projectData;
    return rest;
  }, [projectData]);

  // Memoize features without tasks
  const features = useMemo(
    () => projectData.features?.map(({ tasks, ...rest }) => rest) ?? [],
    [projectData.features],
  );

  // Memoize tasks, keyed by their feature ID

  const tasks = useMemo(
    () =>
      projectData.features?.reduce<TaskSelection[]>((allTasks, feature) => {
        // Safely concatenate feature tasks if they exist, or an empty array if they don't
        return [...allTasks, ...(feature.tasks ?? [])];
      }, [] as TaskSelection[]) ?? [],
    [projectData.features],
  );

  // Memoize transformed developers data
  const devs = useMemo(
    () =>
      projectData.devs?.map(({ contributor }) => ({
        id: contributor.id,
        image: contributor.image,
        email: contributor.email,
        name: contributor.name,
      })) ?? [],
    [projectData.devs],
  );

  return { project: projectInfo, features, tasks, devs };
};
