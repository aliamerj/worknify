import { GoAlertFill } from "react-icons/go";

export const SideErrorMessage = ({
  errorMessage,
}: {
  errorMessage: string;
}) => {
  return (
    <div
      className="fixed bottom-0 left-0 mb-5 ml-5 flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm text-white shadow-lg"
      style={{ animation: "floatError 1.5s ease-in-out" }}
    >
      <GoAlertFill className="text-lg" />
      {errorMessage}
    </div>
  );
};
