import Image from "next/image";
import { LiaLaptopCodeSolid } from "react-icons/lia";
import { Divider, Link } from "@nextui-org/react";
import LinkNext from "next/link";
import { AppRouter } from "@/utils/router/app_router";
import axios from "axios";

export interface IProjectCard {
  id: number;
  name: string;
  projectGoal: string;
  logo: string | null;
  techUsed: string;
  link: string;
}

export const ProjectCard = async ({
  id,
  logo,
  projectGoal,
  link,
  name,
  techUsed,
}: IProjectCard) => {
  let isValidImage = false;
  if (logo) {
    try {
      const response = await axios.head(logo);
      isValidImage = response.status === 200;
    } catch (error) {
      isValidImage = false;
    }
  }
  return (
    <div
      key={id}
      className="max-w-sm overflow-hidden rounded-md bg-gray-100 shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-xl"
    >
      <LinkNext href={`${AppRouter.viewProject}${id}`}>
        <div className="flex h-32 w-full items-center justify-center bg-gray-300">
          {logo && isValidImage ? (
            <Image
              src={logo}
              alt="Project Logo"
              height={124}
              width={482}
              style={{ objectFit: "contain" }}
              className="max-h-full max-w-full"
            />
          ) : (
            <LiaLaptopCodeSolid className="h-28 w-36 text-gray-800" />
          )}{" "}
        </div>{" "}
        <div className="px-6 py-4">
          <div className="mb-2 text-xl font-bold">{name}</div>
          <p className="text-base text-gray-700">{projectGoal}</p>
        </div>
        <div className="px-6 pb-2 pt-4">
          {techUsed.split(",").map((tech, index) => (
            <span
              key={index}
              className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
            >
              {tech}
            </span>
          ))}
        </div>
      </LinkNext>
      <Divider />
      <div className="p-5">
        <Link isExternal showAnchorIcon href={`https://github.com/${link}`}>
          Visit source code on GitHub.
        </Link>
      </div>
    </div>
  );
};
