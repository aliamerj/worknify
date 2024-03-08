import { calcCompletionSeparated } from "@/utils/helper_function";
import { Progress } from "@nextui-org/react";
import React, { useCallback } from "react";
import { useFeatureInfo, useTasksInfo } from "../../context/hooks";

export default function CompletionBar() {
  const features = useFeatureInfo();

  const tasks = useTasksInfo();
  const projectCmpilation = useCallback(
    () => calcCompletionSeparated(features, tasks),
    [features, tasks],
  );
  return (
    <Progress
      label="Completion Progress"
      aria-label="Completion..."
      size="sm"
      value={projectCmpilation()}
      color="primary"
      showValueLabel={true}
      className="max-w-full"
    />
  );
}
