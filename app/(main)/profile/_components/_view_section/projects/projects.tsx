import { Slide } from "@/animation/Slide";
import { AppRouter } from "@/utils/router/app_router";
import { Divider, Link } from "@nextui-org/react";
import Image from "next/image";
import LinkNext from "next/link";
import { LiaLaptopCodeSolid } from "react-icons/lia";
type Project = {
  id: number;
  name: string;
  projectGoal: string;
  logo?: string | null;
  techUsed: string;
  link: string;
};

export const Projects = ({ projects }: { projects: Project[] }) => {
  return (
    <section className="mx-12 mt-32">
      <Slide delay={0.16}>
        <div className="mb-16">
          <h1 className="font-incognito mb-8 text-4xl font-bold leading-tight tracking-tighter text-gray-800 md:text-5xl dark:text-white">
            Projects
          </h1>
        </div>
      </Slide>

      <Slide delay={0.18}>
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
          {projects.map((project) => (
            <div className="max-w-sm overflow-hidden rounded-md bg-gray-100 shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-xl">
              <LinkNext href={AppRouter.viewProject + project.id}>
                <div className="flex h-32 w-full items-center justify-center bg-gray-300">
                  {project.logo ? (
                    <Image
                      layout="fill"
                      src={project.logo}
                      objectFit="cover"
                      alt="Project Logo"
                    />
                  ) : (
                    <LiaLaptopCodeSolid className="h-full w-full" />
                  )}
                </div>
                <div className="px-6 py-4">
                  <div className="mb-2 text-xl font-bold">{project.name}</div>
                  <p className="text-base text-gray-700">
                    {project.projectGoal}
                  </p>
                </div>
                <div className="px-6 pb-2 pt-4">
                  {project.techUsed.split(",").map((tech, index) => (
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
                <Link
                  isExternal
                  showAnchorIcon
                  href={`https://github.com/${project.link}`}
                >
                  Visit source code on GitHub.
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Slide>
    </section>
  );
};
