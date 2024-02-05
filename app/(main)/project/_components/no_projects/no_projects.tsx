import { AppRouter } from "@/utils/router/app_router";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { FaClipboardList } from "react-icons/fa";


export const Noprojects = ({ isCurrentUser, userName }:{isCurrentUser: boolean, userName?:string}) => {
   const message = isCurrentUser ||  userName
    ? "You haven't created any projects yet. Want to start a new adventure?"
    : `${userName? userName + "hasn't" : "This user hasn't"} started any projects yet. Stay tuned for future updates!`;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4 text-center">
      <FaClipboardList className="text-6xl text-gray-400 mb-4" />
      <h1 className="text-3xl font-semibold text-gray-800 mb-2">
        No Projects Found
      </h1>
      <p className="text-gray-600 mb-6">{message}</p>
      {isCurrentUser && userName && (
        <Button as={Link} color="success" variant="shadow" href={AppRouter.createProject} className="text-white font-bold py-2 px-4 rounded-lg">
          Create New Project
        </Button>
      )}
    </div>)}
