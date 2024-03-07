import { formatDate } from "@/utils/helper_function";
import { DroppableProvided } from "@hello-pangea/dnd";

import {
  AiFillTag,
  AiOutlineCalendar,
  AiOutlineCheckSquare,
  AiOutlineClockCircle,
  AiOutlineFileText,
} from "react-icons/ai";
import { DroppableArea } from "../droppable_area/droppable_area";
import { KanbanTask } from "../kanban_task/kanban_task";
import { Button, useDisclosure } from "@nextui-org/react";
import { AddTaskModal } from "../add_task_modal/add_task_modal";
import { useSetTasksToUpdate } from "../../context/hooks";
import { FeatureSelection } from "@/db/schemes/featureSchema";

export const BoardFeature = ({
  provided,
  isDraggingOver,
  isDev,
  isOwner,
  feature,
}: {
  provided: DroppableProvided;
  isDraggingOver: boolean;
  isOwner?: string;
  isDev?: string;
  feature: FeatureSelection;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const setSelectedTaskToUpdate = useSetTasksToUpdate();

  return (
    <div
      {...provided.droppableProps}
      ref={provided.innerRef}
      className="space-y-6"
    >
      {isDraggingOver && <DroppableArea placeholder={provided.placeholder} />}

      <div className="border-b border-gray-200 p-4">
        <h2 className="flex items-center space-x-2 text-xl font-bold">
          <AiOutlineFileText className="text-primary" />
          <span>{feature.featureName}</span>
        </h2>
        {feature.description && (
          <p className="mt-2 flex items-center space-x-2 text-gray-600">
            <AiOutlineCalendar className="text-info" />
            <span>{feature.description}</span>
          </p>
        )}
        <div className="mt-2 flex items-center gap-2">
          {feature.tags?.split(";").map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
            >
              <AiFillTag className="text-blue-700" />
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
          <span>
            <AiOutlineClockCircle /> Start Date:{" "}
            {feature.startDate ? formatDate(feature.startDate) : "N/A"}
          </span>
          <span>
            <AiOutlineCheckSquare /> End Date:{" "}
            {feature.endDate ? formatDate(feature.endDate) : "N/A"}
          </span>
        </div>
        {isDev ||
          (isOwner && (
            <div className="mt-5">
              <Button
                color="primary"
                variant="shadow"
                size="lg"
                onPress={(_) => {
                  setSelectedTaskToUpdate(undefined);
                  onOpen();
                }}
              >
                Create New Task
              </Button>
            </div>
          ))}
      </div>
      <KanbanTask featureId={feature.id} onOpen={onOpen} />
      <AddTaskModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        featureId={feature.id}
      />
    </div>
  );
};
