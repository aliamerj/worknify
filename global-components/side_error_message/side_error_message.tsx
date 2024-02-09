import { GoAlertFill } from "react-icons/go";
import { BsCheckCircleFill } from "react-icons/bs"; // For success messages

export const SideErrorMessage = ({
  errorMessage,
  isError,
}: {
  errorMessage: string;
  isError: boolean;
}) => {
  return (
    <div
      className={`fixed bottom-0 left-0 z-40 mb-5 ml-5 flex items-center gap-2 rounded-lg p-4 text-sm shadow-lg transition-all duration-300 ${
        isError ? "bg-red-500" : "bg-green-500"
      }`}
      style={{ animation: "floatError 1.5s ease-in-out" }}
    >
      {isError ? (
        <GoAlertFill className="text-lg" />
      ) : (
        <BsCheckCircleFill className="text-lg" />
      )}
      {errorMessage}
    </div>
  );
};
