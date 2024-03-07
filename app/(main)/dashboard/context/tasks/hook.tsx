import { useCallback, useReducer } from "react";
import { TaskSelection, ColumnId } from "@/db/schemes/taskSchema";
import { ColumnsTask, taskReducer } from "./reducer";
const initialColumns: ColumnsTask = {
  New: [],
  "In Progress": [],
  "Ready to Test": [],
  Done: [],
};

export const useTasks = (initialTasks: TaskSelection[]) => {
  const getColumns = useCallback(
    (tasks: TaskSelection[]) => {
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
    [initialColumns],
  );

  const [tasks, dispatchTask] = useReducer(
    taskReducer,
    getColumns(initialTasks),
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

  return { tasks, pushTask, removeTask, updateTask, updateTaskOrder };
};
