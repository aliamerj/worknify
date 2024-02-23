import { AppRouter } from "@/utils/router/app_router";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { FaUserPlus } from "react-icons/fa";

/**
 * Renders a message and an action button based on whether the current user has a profile or not.
 * param {boolean} isCurrentUser - A boolean value indicating whether the current user is the owner of the profile.
 * returns {JSX.Element} - The rendered component.
 */
export const Noprofile = ({ isCurrentUser }: { isCurrentUser: boolean }): JSX.Element => {
  const message = isCurrentUser
    ? "You don't have a profile yet. Ready to start building it RIGHT NOW !!"
    : "This user hasn't created a profile yet. Check back soon!";

  const actionButton = isCurrentUser ? (
    <Button as={Link} href={AppRouter.createProfile} color="primary" variant="shadow">
      Create Your Profile
    </Button>
  ) : null;

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <div className="mb-4 inline-block rounded-full bg-blue-100 p-4">
          <FaUserPlus className="text-6xl text-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Oops! Profile Not Found.</h1>
        <p className="mb-2 mt-2 text-gray-600">{message}</p>
        {actionButton}
      </div>
    </div>
  );
};
