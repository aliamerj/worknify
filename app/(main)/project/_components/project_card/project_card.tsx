import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppRouter } from "@/utils/router/app_router";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { DeleteProjectBtn } from "../delete_modal.tsx/delete_modal";
import { Progress } from "@nextui-org/react";
import { AboutProjectProps } from "../projects_grid/projects_grid";
import { LiaLaptopCodeSolid } from "react-icons/lia";
import {
  FaUserFriends,
  FaUserTie,
  FaLock,
  FaGlobe,
  FaUnlock,
} from "react-icons/fa";
import { databaseDrizzle } from "@/db/database";
import { eq } from "drizzle-orm";
export const ProjectCard = async ({
  owner,
  id,
  logo,
  name,
  projectGoal,
  compilation,
  type,
  fullName,
}: AboutProjectProps & { fullName: string }) => {
  const devs = await databaseDrizzle.query.dev.findMany({
    where: (d) => eq(d.projectId, id),
    columns: {
      devId: true,
    },
  });

  const session = await getServerSession(authOptions);
  const isCreator = owner === session?.user.id;
  //const githubLink = `https://github.com/${link}`;

  const projectTypeIcon =
    type === "private" ? (
      <FaLock />
    ) : type === "public" ? (
      <FaGlobe />
    ) : (
      <FaUnlock />
    );
  return (
    <div
      role="link"
      className="relative mb-4 overflow-hidden rounded-lg bg-white shadow-lg transition duration-300 hover:shadow-xl"
    >
      {isCreator ? (
        <span className="absolute left-0 top-0 z-10 rounded-br-lg bg-primary px-3 py-1 text-sm font-semibold text-white">
          Creator
        </span>
      ) : (
        <span className="absolute left-0 top-0 z-10 rounded-br-lg bg-success px-3 py-1 text-sm font-semibold text-white">
          Contributor
        </span>
      )}
      <div className="flex flex-col md:flex-row">
        <div className="flex-grow p-4">
          <Link
            href={AppRouter.viewProject + id}
            className="mb-3 flex items-center space-x-4"
          >
            <div className="relative h-20 w-20 flex-shrink-0 sm:h-36 sm:w-36 md:h-44 md:w-44">
              {logo ? (
                <Image
                  src={logo}
                  alt={`${name} Logo`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              ) : (
                <LiaLaptopCodeSolid className="h-full w-full" />
              )}
            </div>
            <div className="flex-grow">
              <h5 className="text-xl font-bold text-gray-900">{name}</h5>
              <p className="md:text-md text-sm text-gray-700">
                <span className="pr-1 text-lg font-bold">Goal:</span>
                {projectGoal}
              </p>
              <div className="md:text-md mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  {projectTypeIcon}
                  <span>Project Type: {type}</span>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <FaUserFriends />
                  <span>Developers: {devs.length + 1}</span>
                </div>

                {/*  <div className="mt-2 flex items-center space-x-2">
                  <FaGithub />
                  <Link
                    href={''}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    View on GitHub
                  </Link>
                </div>*/}
                <div className="mt-2 flex items-center space-x-2">
                  <FaUserTie />
                  <span>Owner: {fullName}</span>
                </div>
              </div>

              <Progress
                className="pt-1 text-gray-600"
                label="Compilation"
                aria-label="compilation"
                size="sm"
                value={compilation + 10}
                color="primary"
                showValueLabel={true}
              />
            </div>
          </Link>
        </div>

        {isCreator && (
          <div className="flex flex-col justify-center space-y-2 bg-gray-100 p-4">
            <Link
              href={AppRouter.editProject + id}
              className="w-full rounded bg-blue-500 px-2 py-1 text-center text-sm text-white hover:bg-blue-600"
            >
              Edit
            </Link>
            <DeleteProjectBtn projectName={name} projectId={id} />
          </div>
        )}
      </div>
    </div>
  );
};
