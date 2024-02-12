import { FeatureSelection } from "@/db/schemes/featureSchema";
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

export type ColumnId = "New" | "In Progress" | "Ready to Test" | "Done";
export interface Task {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ColumnId;
  assignedTo: string;
}

const mockTasks: Task[] = [
  {
    id: "task-1",
    name: "Design the user interface",
    description:
      "Create wireframes and high-fidelity designs for the new feature.",
    startDate: "2021-09-01",
    endDate: "2021-09-10",
    status: "New",
    assignedTo: "Alice",
  },
  {
    id: "task-2",
    name: "Implement feature X",
    description: "Develop the backend and frontend components for feature X.",
    startDate: "2021-09-05",
    endDate: "2021-09-20",
    status: "In Progress",
    assignedTo: "Bob",
  },
  {
    id: "task-3",
    name: "Write unit tests",
    description:
      "Cover all new functionality with unit tests to ensure reliability.",
    startDate: "2021-09-15",
    endDate: "2021-09-25",
    status: "Ready to Test",
    assignedTo: "Charlie",
  },
  {
    id: "task-4",
    name: "Deploy to staging",
    description:
      "Deploy the latest build to the staging environment for testing.",
    startDate: "2021-09-26",
    endDate: "2021-09-30",
    status: "Done",
    assignedTo: "Dave",
  },
];

export const BoardFeature = ({
  provided,
  feature,
  isDraggingOver,
}: {
  provided: DroppableProvided;
  feature: FeatureSelection;
  isDraggingOver: boolean;
}) => {
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
      </div>
      <KanbanTask tasks={mockTasks} />
    </div>
  );
};
