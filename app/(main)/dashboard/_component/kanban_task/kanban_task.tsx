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
import { ColumnId } from "@/db/schemes/taskSchema";
import { useDashboardContext } from "../../context/context_dashboard";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useApiCallContext } from "@/utils/context/api_call_context";
import { ReorderTaskSchema } from "@/utils/validations/taskValidation";
import { ApiRouter } from "@/utils/router/app_router";

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
  featureId,
  onOpen,
}: {
  featureId: number;
  onOpen: () => void;
}) => {
  const { taskColumn, taskActions, project } = useDashboardContext();
  const { setIsLoading, setMessageRes } = useApiCallContext();
  const [newTasksOrder, setNewTasksOrder] = useState<ReorderTaskSchema>();

  const onDragEnd: OnDragEndResponder = (result) => {
    const { source, destination } = result;

    // Early return if dropped outside a droppable area or no movement
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const startColumnId = source.droppableId as ColumnId;
    const finishColumnId = destination.droppableId as ColumnId;

    // Clone the current columns to avoid direct state mutation
    let newColumns = { ...taskColumn };
    const startTasks = Array.from(newColumns[startColumnId]);
    const movedTask = startTasks[source.index];

    // Remove the task from its original position
    startTasks.splice(source.index, 1);

    if (startColumnId === finishColumnId) {
      // Insert the task at its new position within the same column
      startTasks.splice(destination.index, 0, movedTask);
      newColumns[startColumnId] = startTasks;
    } else {
      // Handle moving between columns
      const finishTasks = Array.from(newColumns[finishColumnId]);
      movedTask.status = finishColumnId; // Update the task's status
      finishTasks.splice(destination.index, 0, movedTask);
      newColumns[startColumnId] = startTasks;
      newColumns[finishColumnId] = finishTasks;
    }

    // Update the local state with the new columns
    taskActions.updateTaskOrder(newColumns);

    // Prepare and send the update payload to the backend
    // Assuming a more efficient backend update mechanism
    const updatePayload: ReorderTaskSchema = {
      taskId: movedTask.id,
      featureId: featureId,
      projectId: project.id,
      newStatus: finishColumnId !== startColumnId ? finishColumnId : null,

      newOrder: destination.index + 1,
    };
    setNewTasksOrder(updatePayload);
  };

  const isInitialMount = useRef(true);
  useEffect(() => {
    async function updates() {
      setIsLoading(true);
      try {
        const res = await axios.patch(ApiRouter.reorderTasks, newTasksOrder);
        setMessageRes({ isError: false, message: res.data.message });
      } catch (error: any) {
        setMessageRes({
          isError: true,
          message: error.response.data.message,
        });
      }
      setIsLoading(false);
    }
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (newTasksOrder) {
        updates();
      }
    }
  }, [newTasksOrder, setNewTasksOrder]);

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
                  {tasks
                    .sort((a, b) => a.order - b.order)
                    .map(
                      (task, index) =>
                        task.featureId === featureId && (
                          <Draggable
                            key={task.id}
                            draggableId={task.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <TaskCard
                                task={task}
                                provided={provided}
                                onOpen={onOpen}
                              />
                            )}
                          </Draggable>
                        ),
                    )}
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
