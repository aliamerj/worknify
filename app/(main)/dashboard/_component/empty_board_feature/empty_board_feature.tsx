import { DroppableProvided } from "@hello-pangea/dnd";
import { AiOutlineArrowLeft } from "react-icons/ai";

export const EmptyBoardFeature = ({
  provided,
}: {
  provided: DroppableProvided;
}) => {
  return (
    <div
      {...provided.droppableProps}
      ref={provided.innerRef}
      className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-400 p-10"
      style={{
        height: "calc(100vh - 260px)",
      }}
    >
      <div className="flex items-center justify-center space-x-2 text-lg text-gray-600">
        <AiOutlineArrowLeft className="text-xl font-bold text-primary" />
        <p>Drop feature card to explore the dashboard</p>
      </div>

      <p className="text-sm text-gray-500">
        Discover detailed insights and more...
      </p>
      {provided.placeholder}
    </div>
  );
};
