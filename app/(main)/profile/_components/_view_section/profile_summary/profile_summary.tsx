import { FaTasks } from "react-icons/fa";
import { MdOutlineStar } from "react-icons/md";
import { GrProjects } from "react-icons/gr";
import Link from "next/link";
import { AppRouter } from "@/utils/router/app_router";

/**
 * Renders a summary of a user's profile, including the number of stars, completed tasks, and projects contributed.
 * @param stars - The number of stars received by the user.
 * @param projects - The number of projects contributed by the user.
 * @param userId - The ID of the user.
 * @returns The rendered profile summary component.
 */
export const ProfileSummary = ({
  stars,
  projects,
  userId,
}: {
  stars: number;
  projects: number;
  userId: string;
}) => {
  return (
    <div className="bg-primary py-2 text-white">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Stars */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-2">
            <MdOutlineStar className="text-2xl sm:text-3xl md:text-3xl" />
            <span className="text-sm font-semibold sm:text-base md:text-lg">
              Stars
            </span>
          </div>
          <h1 className="text-lg font-bold sm:text-xl md:text-2xl">{stars}</h1>
        </div>

        {/* Completed Tasks */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-2">
            <FaTasks className="text-2xl sm:text-3xl md:text-3xl" />
            <span className="text-sm font-semibold sm:text-base md:text-lg">
              Completed Tasks
            </span>
          </div>
          <h1 className="text-lg font-bold sm:text-xl md:text-2xl">0</h1>
        </div>

        {/* Projects Contributed */}
        <Link href={AppRouter.myProject + userId}>
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-2">
              <GrProjects className="text-2xl sm:text-3xl md:text-3xl" />
              <span className="text-sm font-semibold sm:text-base md:text-lg">
                Projects Contributed
              </span>
            </div>
            <h1 className="text-lg font-bold sm:text-xl md:text-2xl">
              {projects}
            </h1>
          </div>
        </Link>
      </div>
    </div>
  );
};
