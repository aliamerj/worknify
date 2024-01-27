import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ProjectSelection } from "@/db/schemes/projectSchema";
import { AppRouter } from "@/utils/router/app_router";
import { Divider } from "@nextui-org/react";
import DOMPurify from "isomorphic-dompurify";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

export const ProjectCard = async ({
  owner,
  id,
  logo,
  name,
  projectGoal,
  description,
}: ProjectSelection) => {
  const session = await getServerSession(authOptions);
  const isCreator = owner === session?.user.id;

  const truncateDescription = (text: string) => {
    const textClean = DOMPurify.sanitize(text);
    const words = textClean.split(" ");
    return words.length > 50 ? words.slice(0, 50).join(" ") + "..." : textClean;
  };

  return (
    <Link href={AppRouter.viewProject + id}>
      <div className="relative mb-4 overflow-hidden rounded-lg bg-white shadow-lg">
        {isCreator ? (
          <span className="absolute left-0 top-0 rounded-br-lg bg-primary px-3 py-1 text-sm font-semibold text-white">
            Creator
          </span>
        ) : (
          <span className="absolute left-0 top-0 rounded-br-lg bg-success px-3 py-1 text-sm font-semibold text-white">
            Contributor
          </span>
        )}{" "}
        <div className="flex">
          <div className="flex-grow p-4">
            <div className="mb-3 flex items-center space-x-4">
              <div className="relative h-20 w-20 flex-shrink-0 sm:h-36 sm:w-36 md:h-44 md:w-44">
                <Image
                  src={logo}
                  alt={`${name} Logo`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>{" "}
              <div>
                <h5 className="text-xl font-bold text-gray-900">{name}</h5>
                <p className="text-md text-gray-700">{projectGoal}</p>
              </div>
            </div>
            <Divider />
            <p
              className="text-md py-2 text-gray-600"
              dangerouslySetInnerHTML={{
                __html: truncateDescription(description),
              }}
            ></p>
          </div>
          {isCreator && (
            <div className="flex flex-col justify-center space-y-2 bg-gray-100 p-4">
              <button className="rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600">
                Edit
              </button>
              <button className="rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
