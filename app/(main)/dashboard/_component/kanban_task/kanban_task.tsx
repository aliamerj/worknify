import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { IconType } from "react-icons";
import {
  AiOutlineCheckCircle,
  AiOutlineExperiment,
  AiOutlinePlusCircle,
  AiOutlineSync,
} from "react-icons/ai";
import { TaskCard } from "../task_card/task_card";
import { ColumnsTask, useTaskColumns } from "../../hooks/useTasks";
import { ColumnId, TaskSelection } from "@/db/schemes/taskSchema";

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
export const KanbanTask = ({
  updateTaskOrder,
  taskColumn,
}: {
  updateTaskOrder: (columnsTask: ColumnsTask) => void;
  taskColumn: ColumnsTask;
}) => {
  const onDragEnd: OnDragEndResponder = (result) => {
    const { source, destination } = result;

    // if the task is dropped outside a droppable area
    if (!destination) return;

    const startColumnId = source.droppableId as ColumnId;
    const finishColumnId = destination.droppableId as ColumnId;

    const startColumn = taskColumn[startColumnId];
    const finishColumn = taskColumn[finishColumnId];

    // Reordering within the same column
    if (startColumnId === finishColumnId) {
      const newTasks = Array.from(startColumn);
      const [removedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removedTask);

      // Update the order property based on the task's new index
      const updatedTasks = newTasks.map((task, index) => ({
        ...task,
        order: index,
      }));
      updateTaskOrder({
        ...taskColumn,
        [startColumnId]: updatedTasks,
      });
      // Optionally, send update to the backend
      // updateTasksInDatabase(startColumnId, updatedTasks);
    } else {
      // Moving from one column to another
      const startTasks = Array.from(startColumn);
      const finishTasks = Array.from(finishColumn);
      const [removedTask] = startTasks.splice(source.index, 1);

      // Update the removed task's status and reset its order
      const updatedRemovedTask = {
        ...removedTask,
        status: finishColumnId,
        order: destination.index,
      };
      finishTasks.splice(destination.index, 0, updatedRemovedTask);

      // Update the order property for both start and finish column tasks
      const updatedStartTasks = startTasks.map((task, index) => ({
        ...task,
        order: index,
      }));
      const updatedFinishTasks = finishTasks.map((task, index) => ({
        ...task,
        order: index,
      }));

      updateTaskOrder({
        ...taskColumn,
        [startColumnId]: updatedStartTasks,
        [finishColumnId]: updatedFinishTasks,
      });

      // Optionally, send updates to the backend
      // updateTasksInDatabase(startColumnId, updatedStartTasks);
      //updateTasksInDatabase(finishColumnId, updatedFinishTasks);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-wrap justify-between gap-4">
        {Object.entries(taskColumn).map(([columnId, tasks]) => {
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
                    className={`font-semibold ${textColor} flex items-center gap-4 pb-2`}
                  >
                    <ColumnIcon className="text-2xl" />
                    <h3>{columnId}</h3>
                  </div>
                  {tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
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
