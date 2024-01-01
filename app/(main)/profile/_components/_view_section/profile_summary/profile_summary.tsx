import { FaTasks } from "react-icons/fa";
import { MdOutlineStar } from "react-icons/md";
import { GrProjects } from "react-icons/gr";
import { StarSelection } from "@/db/schemes/profileSchema";

export const ProfileSummary = ({ stars }: { stars: StarSelection[] }) => {
  return (
    <div className="bg-primary py-2 text-white">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-2">
            <MdOutlineStar className="text-2xl sm:text-3xl md:text-3xl" />
            <span className="text-sm font-semibold sm:text-base md:text-lg">
              Stars
            </span>
          </div>
          <h1 className="text-lg font-bold sm:text-xl md:text-2xl">
            {stars.length}
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-2">
            <FaTasks className="text-2xl sm:text-3xl md:text-3xl" />
            <span className="text-sm font-semibold sm:text-base md:text-lg">
              Completed Tasks
            </span>
          </div>
          <h1 className="text-lg font-bold sm:text-xl md:text-2xl">0</h1>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-2">
            <GrProjects className="text-2xl sm:text-3xl md:text-3xl" />
            <span className="text-sm font-semibold sm:text-base md:text-lg">
              Projects Contributed
            </span>
          </div>
          <h1 className="text-lg font-bold sm:text-xl md:text-2xl">0</h1>
        </div>
      </div>
    </div>
  );
};
