
import { useState, useCallback } from "react";
import { ColumnId, TaskSelection } from "@/db/schemes/taskSchema";


export type ColumnsTask = Record<ColumnId, TaskSelection[]>;
export const useTaskColumns = (initialTask: ColumnsTask) => {
  const [taskColumn, setTaskColumn] = useState<ColumnsTask>(initialTask);

  const pushTask = useCallback((task: TaskSelection) => {
  setTaskColumn((current)=> ({...current, new:[...current.New,task]}))
  }, []);

  const removeTask = useCallback((id: number, columnId:ColumnId) => {
    setTaskColumn((current) => {
      current[columnId]= current[columnId].filter(t=>t.id !== id);
      return current
    });
  }, []);

  const updateTask = useCallback((task: TaskSelection) => {
    setTaskColumn((current) => {
      current[task.status as ColumnId] = current[task.status].map((t)=> (t.id=== task.id ? task:t));
      return current
    });},[]);

const updateTaskOrder = useCallback((columns:ColumnsTask) => {
   setTaskColumn(columns)
  },[]);

  return {taskColumn,
    pushTask,
    removeTask,
    updateTask,
    updateTaskOrder,
  };
};
