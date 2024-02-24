import { Slide } from "@/animation/Slide";
import { IoSearch } from "react-icons/io5";
import { IProjectCard, ProjectCard } from "../project_card/project_card";

import { ProjectTypeOptions } from "../project_type_options/project_type_options";
import { projectTestData } from "./test_data";
import { Pagination } from "@/global-components/pagination/pagination";
import { databaseDrizzle } from "@/db/database";
import { ProjectSelection, projectType } from "@/db/schemes/projectSchema";

export const ProjectsBox = async ({
  visibility,
  currentPage,
}: {
  visibility: string;
  currentPage: string;
}) => {
  const projects: IProjectCard[] = projectTestData.slice(0, 6);
  const types = Object.values(projectType["enumValues"]);

  await databaseDrizzle.query.project.findMany({
    where:
      visibility && types.includes(visibility.toLowerCase())
        ? (p, o) => o.eq(p.type, visibility.toLowerCase())
        : undefined,
    columns: {
      id: true,
      logo: true,
      name: true,
      projectGoal: true,
      techUsed: true,
      link: true,
    },
  });

  return (
    <div className="py-8">
      <div className="flex min-h-screen flex-col items-center rounded-lg bg-gray-100 p-4 shadow-md">
        <div className="flex w-full max-w-screen-xl flex-col items-center rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-5 text-center text-2xl font-bold leading-snug text-gray-800">
            Discover Projects
          </h1>
          <div className="flex items-center rounded-lg border-2 bg-gray-100 md:w-1/2">
            <input
              className="flex-grow rounded-lg bg-transparent p-4 focus:outline-none"
              type="text"
              placeholder="Search for projects..."
            />
            <button className="p-4">
              <IoSearch className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="flex items-center pt-3">
            <ProjectTypeOptions selectedOption={visibility} />
          </div>
          <Slide delay={0.18}>
            <div className="my-5 grid w-full grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))}
            </div>
          </Slide>

          <div className="w-full py-4">
            <Pagination
              currentPageStr={currentPage}
              pageSize={6}
              itemCount={10}
            />
          </div>
        </div>
      </div>{" "}
    </div>
  );
};
