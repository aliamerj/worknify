import { DraggableProvided } from "@hello-pangea/dnd";
import React from "react";
import { AiOutlineCheckSquare, AiOutlineClockCircle } from "react-icons/ai";

export const TaskCard = ({
  task,
  provided,
}: {
  task: any;
  provided: DraggableProvided;
}) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="space-y-1 rounded bg-white p-2 shadow"
    >
      <h4 className="text-md font-bold">{task.name}</h4>
      <p className="text-sm text-gray-600">{task.description}</p>
      <div className="flex justify-between text-xs text-gray-500">
        <span>
          <AiOutlineClockCircle /> {task.startDate}
        </span>
        <span>
          <AiOutlineCheckSquare /> {task.endDate}
        </span>
      </div>
      <div className="text-right">
        <span className="inline-block rounded bg-green-100 px-2 py-1 text-xs text-green-800">
          Assigned to: {task.assignedTo}
        </span>
      </div>
    </div>
  );
};
