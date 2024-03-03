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
  tasks: Task[];
}

export function calculateProjectCompletion(
  features: FeatureWithTasks[],
): number {
  const totalFeatures = features.length;

  if (totalFeatures === 0) return 0;

  const totalFeatureCompletion = features.reduce((totalCompletion, feature) => {
    const featureCompletion = feature.tasks.reduce((total, task) => {
      const taskCompletion = (() => {
        switch (task.status) {
          case "New":
            return 0;
          case "In Progress":
            return 0.25;
          case "Ready to Test":
            return 0.75;
          case "Done":
            return 1;
          default:
            return 0;
        }
      })();
      return total + taskCompletion;
    }, 0);

    const avgFeatureCompletion =
      feature.tasks.length > 0
        ? (featureCompletion / feature.tasks.length) * 100
        : 0;

    return totalCompletion + avgFeatureCompletion;
  }, 0);

  return totalFeatureCompletion / totalFeatures;
}
