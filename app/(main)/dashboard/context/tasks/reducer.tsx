import { ColumnId, TaskSelection } from "@/db/schemes/taskSchema";
import { ColumnsTask } from "../../hooks/useTasks";

type TaskAction =
  | { type: "PUSH_TASK"; payload: TaskSelection }
  | { type: "REMOVE_TASK"; payload: { id: number; columnId: ColumnId } }
  | { type: "UPDATE_TASK"; payload: TaskSelection }
  | { type: "UPDATE_TASK_ORDER"; payload: ColumnsTask };
export const taskReducer = (
  state: ColumnsTask,
  action: TaskAction,
): ColumnsTask => {
  switch (action.type) {
    case "PUSH_TASK":
      return {
        ...state,
        [action.payload.status]: [
          ...state[action.payload.status],
          action.payload,
        ],
      };
    case "REMOVE_TASK":
      return {
        ...state,
        [action.payload.columnId]: state[action.payload.columnId].filter(
          (task) => task.id !== action.payload.id,
        ),
      };
    case "UPDATE_TASK":
      return {
        ...state,
        [action.payload.status]: state[action.payload.status].map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task,
        ),
      };
    case "UPDATE_TASK_ORDER":
      return action.payload;
    default:
      return state;
  }
};
