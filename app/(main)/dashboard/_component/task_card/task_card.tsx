import { TaskSelection } from "@/db/schemes/taskSchema";
import { formatDate } from "@/utils/helper_function";
import { DraggableProvided } from "@hello-pangea/dnd";
import React from "react";
import {
  AiOutlineCheckSquare,
  AiOutlineClockCircle,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineUser,
} from "react-icons/ai";
import { useDashboardContext } from "../../context/context_dashboard";
import axios from "axios";
import { ApiRouter } from "@/utils/router/app_router";
import { useApiCallContext } from "@/utils/context/api_call_context";
import { Button } from "@nextui-org/react";

export const TaskCard = ({
  task,
  provided,
  onOpen,
}: {
  task: TaskSelection;
  provided: DraggableProvided;
  onOpen: () => void;
}) => {
  const { devsInfo, setSelectedTaskToUpdate, taskActions } =
    useDashboardContext();
  const { setMessageRes, setIsLoading, isLoading } = useApiCallContext();
  const assignedTo = devsInfo.find((d) => d.id === task.assignedTo);
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="mb-4 flex flex-col justify-between rounded-lg bg-white p-4 shadow transition-shadow duration-200 ease-in-out hover:shadow-lg"
    >
      <div>
        <h4 className="truncate text-lg font-semibold">{task.name}</h4>
        {task.description && (
          <p className="mt-2 text-sm text-gray-600">{task.description}</p>
        )}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          {task.startDate && (
            <div className="flex items-center space-x-1">
              <AiOutlineClockCircle className="text-gray-400" />
              <span>{formatDate(task.startDate)}</span>
            </div>
          )}
          {task.endDate && (
            <div className="flex items-center space-x-1">
              <AiOutlineCheckSquare className="text-gray-400" />
              <span>{formatDate(task.endDate)}</span>
            </div>
          )}
        </div>
        {task.assignedTo && (
          <div className="mt-2 flex items-center justify-end">
            <span className="flex items-center rounded bg-green-100 px-3 py-1 text-xs text-green-800">
              <AiOutlineUser className="mr-1" />
              {`Assigned to: ${assignedTo?.name}`}
            </span>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => {
            setSelectedTaskToUpdate({
              id: task.id,
              featureId: task.featureId,
              projectId: task.projectId,
              name: task.name,
              status: task.status,
              order: task.order,
              assignedTo: task.assignedTo,
              description: task.description ?? undefined,
              timePeriod: {
                startDate: task.startDate ?? null,
                endDate: task.endDate ?? null,
              },
            });
            onOpen();
          }}
          className="flex items-center justify-center rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <AiOutlineEdit />
        </button>
        <Button
          variant="solid"
          className="rounded-full"
          color="danger"
          size="sm"
          isIconOnly
          isDisabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            try {
              const res = await axios.delete(ApiRouter.tasks, {
                data: {
                  projectId: task.projectId,
                  featureId: task.featureId,
                  taskId: task.id,
                },
              });
              setMessageRes({
                isError: false,
                message: res.data.message,
              });
              taskActions.removeTask(task.id, task.status);
            } catch (error: any) {
              setMessageRes({
                isError: true,
                message: error.response.data.message,
              });
            }
            setIsLoading(false);
          }}
        >
          <AiOutlineDelete className="text-medium font-bold" />
        </Button>
      </div>
    </div>
  );
};
