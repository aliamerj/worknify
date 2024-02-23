import { FeatureSelection } from "@/db/schemes/featureSchema";
import { TaskSelection } from "@/db/schemes/taskSchema";
import DOMPurify from "dompurify";

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
export function convertContent(htmlContent: string) {
  return { __html: DOMPurify.sanitize(htmlContent) };
}

export function convertTimeToString(stringTime: string | null): string | null {
  return stringTime ? new Date(stringTime).toISOString() : null;
}
export function calculateProjectCompletion(
  features: FeatureSelection[],
  allTasks: TaskSelection[],
) {
  let totalFeatures = features.length;
  let totalFeatureCompletion = 0;
  features.forEach((f) => {
    let myTasks = allTasks.filter((task) => task.featureId === f.id);
    let featureCompletion = 0;

    myTasks.forEach((task) => {
      // Assign completion percentage based on task stage
      let taskCompletion = 0;
      switch (task.status) {
        case "New":
          taskCompletion = 0;
          break;
        case "In Progress":
          taskCompletion = 0.25;
          break;
        case "Ready to Test":
          taskCompletion = 0.75;
          break;
        case "Done":
          taskCompletion = 1;
          break;
      }
      featureCompletion += taskCompletion;
    });

    // Calculate average completion for the feature
    if (allTasks.length > 0) {
      featureCompletion = (featureCompletion / allTasks.length) * 100;
    } else {
      // Handle case where a feature might not have any tasks
      featureCompletion = 0;
    }

    totalFeatureCompletion += featureCompletion;
  });

  // Calculate average feature completion for the project
  let projectCompletion =
    totalFeatures > 0 ? totalFeatureCompletion / totalFeatures : 0;

  return projectCompletion;
}
