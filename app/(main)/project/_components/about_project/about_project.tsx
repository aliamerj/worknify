import { formatDate } from "@/utils/helper_function";
import { AppRouter } from "@/utils/router/app_router";
import { CircularProgress } from "@nextui-org/react";
import Link from "next/link";
import { AiFillLock, AiFillUnlock } from "react-icons/ai";
import { FcLock } from "react-icons/fc";
interface Props {
  owner: string;
  developersCount: number;
  compilation: number;
  projectLink: string;
  startDate: string;
  endDate: string;
  projectType: string;
}

const AboutProject = ({
  owner,
  developersCount,
  compilation,
  projectLink,
  startDate,
  endDate,
  projectType,
}: Props) => {
  const projectTypeIcons: any = {
    public: <AiFillUnlock className="text-xl text-green-500" />,
    private: <AiFillLock className="text-xl text-red-500" />,
    permission: <FcLock className="text-xl" />,
  };

  return (
    <div className="mx-auto mt-10 max-w-4xl rounded-lg bg-white p-6 shadow-md">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Owner */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">Owner</h2>
          <Link
            href={`${AppRouter.viewProfile}/${owner}`}
            className="text-primary hover:underline"
          >
            Go to owner Profile
          </Link>
        </div>

        {/* Developers Count */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">Developers</h2>
          <p className="text-gray-600">{developersCount + 1}</p>
        </div>

        {/* Compilation */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">Compilation</h2>
          <CircularProgress
            value={compilation}
            size="lg"
            showValueLabel={true}
          />
        </div>

        {/* Project Link */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">Project Link</h2>
          <a
            href={`https://github.com/${projectLink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {projectLink}
          </a>
        </div>

        {/* Project Dates */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">Project Dates</h2>
          <p className="text-gray-600">
            {formatDate(startDate)} - {formatDate(endDate)}
          </p>
        </div>

        {/* Project Type */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">Project Type</h2>
          <div className="flex items-center">
            {projectTypeIcons[projectType]}
            <span className="ml-2 capitalize">{projectType}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutProject;
