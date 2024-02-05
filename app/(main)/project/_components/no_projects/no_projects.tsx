import { AppRouter } from "@/utils/router/app_router";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { FaClipboardList } from "react-icons/fa";

export const Noprojects = ({
  isCurrentUser,
  userName,
}: {
  isCurrentUser: boolean;
  userName?: string;
}) => {
  const message =
    isCurrentUser || userName
      ? "You haven't created any projects yet. Want to start a new adventure?"
      : `${userName ? userName + "hasn't" : "This user hasn't"} started any projects yet. Stay tuned for future updates!`;

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <FaClipboardList className="mb-4 text-6xl text-gray-400" />
      <h1 className="mb-2 text-3xl font-semibold text-gray-800">
        No Projects Found
      </h1>
      <p className="mb-6 text-gray-600">{message}</p>
      {isCurrentUser && userName && (
        <Button
          as={Link}
          color="success"
          variant="shadow"
          href={AppRouter.createProject}
          className="rounded-lg px-4 py-2 font-bold text-white"
        >
          Create New Project
        </Button>
      )}
    </div>
  );
};
