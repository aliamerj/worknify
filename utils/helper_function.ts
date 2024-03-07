import { ColumnsTask } from "@/app/(main)/dashboard/context/tasks/reducer";
import { FeatureSelection } from "@/db/schemes/featureSchema";
import { ColumnId } from "@/db/schemes/taskSchema";
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

interface Task {
  status: "New" | "In Progress" | "Ready to Test" | "Done";
}

export interface FeatureWithTasks {
  tasks?: Task[];
}

// Helper function for calculating feature completion for a unified structure
function calcFeatureCompletionUnified(tasks?: Task[]): number {
  const taskCompletionValues = {
    New: 0,
    "In Progress": 0.25,
    "Ready to Test": 0.75,
    Done: 1,
  };

  let total = 0;
  if (tasks && tasks.length > 0) {
    total = tasks.reduce(
      (sum, task) => sum + taskCompletionValues[task.status],
      0,
    );
    return (total / tasks.length) * 100;
  }

  return 0;
}

// Function for the unified structure
export function calcCompletionUnified(features: FeatureWithTasks[]): number {
  const totalFeatures = features.length;
  if (totalFeatures === 0) return 0;

  const totalCompletion = features.reduce(
    (total, feature) => total + calcFeatureCompletionUnified(feature.tasks),
    0,
  );

  return totalCompletion / totalFeatures;
}

// Helper function for calculating feature completion for separated structure
function calcFeatureCompletionSeparated(
  columnsTasks: ColumnsTask,
  featureId: number,
): number {
  const statuses: ColumnId[] = ["New", "In Progress", "Ready to Test", "Done"];
  let totalTasks = 0;
  let totalCompletion = 0;

  statuses.forEach((status) => {
    const featureTasks = columnsTasks[status].filter(
      (task) => task.featureId === featureId,
    );
    totalTasks += featureTasks.length;
    const taskCompletionValues = {
      New: 0,
      "In Progress": 0.25,
      "Ready to Test": 0.75,
      Done: 1,
    };
    totalCompletion += featureTasks.reduce(
      (sum, task) => sum + taskCompletionValues[task.status],
      0,
    );
  });

  return totalTasks > 0 ? (totalCompletion / totalTasks) * 100 : 0;
}

// Function for separated structure
export function calcCompletionSeparated(
  features: FeatureSelection[],
  columnsTasks: ColumnsTask,
): number {
  const totalFeatures = features.length;
  if (totalFeatures === 0) return 0;

  const totalCompletion = features.reduce(
    (total, feature) =>
      total + calcFeatureCompletionSeparated(columnsTasks, feature.id),
    0,
  );

  return totalCompletion / totalFeatures;
}
