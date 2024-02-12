import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { IconType } from "react-icons";
import {
  AiOutlineCheckCircle,
  AiOutlineExperiment,
  AiOutlinePlusCircle,
  AiOutlineSync,
} from "react-icons/ai";
import { TaskCard } from "../task_card/task_card";
import { ColumnId, Task } from "../board_feature/board_feature";

type ColumnStyles = {
  [key in ColumnId]: {
    icon: IconType;
    bgColor: string;
    textColor: string;
  };
};

const columnStyles: ColumnStyles = {
  New: {
    icon: AiOutlinePlusCircle,
    bgColor: "bg-secondary",
    textColor: "text-secondary-100",
  },
  "In Progress": {
    icon: AiOutlineSync,
    bgColor: "bg-warning-300",
    textColor: "text-yellow-800",
  },
  "Ready to Test": {
    icon: AiOutlineExperiment,
    bgColor: "bg-danger-300",
    textColor: "text-orange-800",
  },
  Done: {
    icon: AiOutlineCheckCircle,
    bgColor: "bg-success-300",
    textColor: "text-green-800",
  },
};
export const KanbanTask = ({ tasks }: { tasks: Task[] }) => {
  const initialColumns: Record<ColumnId, Task[]> = {
    New: [],
    "In Progress": [],
    "Ready to Test": [],
    Done: [],
  };
  const columns: Record<ColumnId, Task[]> = tasks.reduce((acc, task) => {
    acc[task.status].push(task);
    return acc;
  }, initialColumns);

  const onDragEnd = (result: any) => {
    /* Implement based on your app's needs */
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-wrap justify-between gap-4">
        {Object.entries(columns).map(([columnId, tasks]) => {
          const {
            icon: ColumnIcon,
            bgColor,
            textColor,
          } = columnStyles[columnId as ColumnId];
          return (
            <Droppable key={columnId} droppableId={columnId}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${bgColor} w-full min-w-80 rounded p-4 shadow  lg:w-1/5`}
                >
                  <div
                    className={`font-semibold ${textColor} flex items-center gap-2 pb-2`}
                  >
                    <ColumnIcon className="text-2xl" />
                    <h3>{columnId}</h3>
                  </div>
                  {tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <TaskCard task={task} provided={provided} />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
};
