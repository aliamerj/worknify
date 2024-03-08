import React, { useCallback } from "react";
import { useTasksInfo } from "../../context/hooks";
import { ColumnsTask } from "../../context/tasks/reducer";

export default function TasKNumber({ featureId }: { featureId: number }) {
  const tasks = useTasksInfo();
  const taskCount = useCallback(() => {
    const taskStatuses: (keyof ColumnsTask)[] = [
      "New",
      "In Progress",
      "Ready to Test",
    ];
    let taskCount = 0;

    taskStatuses.forEach((status) => {
      taskCount += tasks[status].reduce(
        (count, task) => count + (task.featureId === featureId ? 1 : 0),
        0,
      );
    });

    return taskCount;
  }, [tasks]);
  if (taskCount() > 0)
    return (
      <span className="ms-3 inline-flex h-3 w-3 items-center justify-center rounded-full bg-blue-100 p-3 text-small font-medium text-blue-800">
        {taskCount()}
      </span>
    );
  else return <div />;
}
