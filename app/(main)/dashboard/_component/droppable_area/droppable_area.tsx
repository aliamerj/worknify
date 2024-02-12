import { AiOutlineInbox } from "react-icons/ai"; // Assuming you're using react-icons

export const DroppableArea = ({
  placeholder,
}: {
  placeholder: React.ReactNode;
}) => {
  return (
    <div className="relative flex h-full w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-10 transition-colors duration-150 ease-in-out hover:bg-gray-100">
      <div className="text-center">
        <AiOutlineInbox className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-lg font-semibold text-gray-800">
          Drop here to see tasks for this feature
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Drag and drop a feature card into this area
        </p>
      </div>
      <div className="hidden">{placeholder}</div>
    </div>
  );
};
