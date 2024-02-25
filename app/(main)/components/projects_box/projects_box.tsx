import { Slide } from "@/animation/Slide";
import { IProjectCard, ProjectCard } from "../project_card/project_card";
import { ProjectTypeOptions } from "../project_type_options/project_type_options";
import { Pagination } from "@/global-components/pagination/pagination";
import { databaseDrizzle } from "@/db/database";
import { projectType } from "@/db/schemes/projectSchema";
import getTableCount from "@/utils/api_handler/get_table_count";
import NoProjectsFound from "./no_project_found";
import { ProjectSearch } from "./project_search";
const PAGESIZE = 6;

export const ProjectsBox = async ({
  visibility,
  currentPage,
  search,
}: {
  visibility: string;
  currentPage: string;
  search: string;
}) => {
  const types = Object.values(projectType["enumValues"]);
  const projectsCount = await getTableCount("project");
  const page = parseInt(currentPage) || 1;
  const projects: IProjectCard[] = await databaseDrizzle.query.project.findMany(
    {
      where: search
        ? (p, o) =>
            o.or(
              o.ilike(p.name, `%${search}%`),
              o.ilike(p.techUsed, `%${search}%`),
              o.ilike(p.projectGoal, `%${search}%`),
            )
        : visibility && types.includes(visibility.toLowerCase())
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

      orderBy: (p, { asc }) => [asc(p.id)],
      limit: 6,
      offset: (page - 1) * PAGESIZE,
    },
  );

  return (
    <div className="py-8" style={{ minHeight: "70rem" }}>
      <div className="flex min-h-screen flex-col items-center rounded-lg bg-gray-100 p-4 shadow-md">
        <div className="flex min-h-screen w-full max-w-screen-xl flex-col items-center rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-5 text-center text-2xl font-bold leading-snug text-gray-800">
            Discover Projects
          </h1>
          <ProjectSearch />
          <div className="flex items-center pt-3">
            <ProjectTypeOptions selectedOption={visibility} />
          </div>

          <Slide delay={0.18}>
            {projects.length > 0 ? (
              <div className="my-5 grid w-full grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>
            ) : (
              <NoProjectsFound />
            )}
          </Slide>

          <div className="w-full py-4">
            <Pagination
              currentPageStr={currentPage}
              pageSize={PAGESIZE}
              itemCount={projectsCount}
            />
          </div>
        </div>
      </div>{" "}
    </div>
  );
};
