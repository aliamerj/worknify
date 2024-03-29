import { ProjectSelection } from "@/db/schemes/projectSchema";
import { ProjectCard } from "../project_card/project_card";
import { FeatureWithTasks } from "@/utils/helper_function";
export type ProjectProps = {
  id: ProjectSelection["id"];
  owner: ProjectSelection["owner"];
  startDate: ProjectSelection["startDate"];
  endDate: ProjectSelection["endDate"];
  type: ProjectSelection["type"];
  link: ProjectSelection["link"];
  projectGoal: ProjectSelection["projectGoal"];
  logo: ProjectSelection["logo"];
  name: ProjectSelection["name"];
  features: FeatureWithTasks[];
};

const ProjectsGrid = ({
  projects,
  userName,
}: {
  projects: ProjectProps[];
  userName: string;
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          {userName}'s Projects
        </h1>
        <p className="mt-2 text-gray-600">
          Browse through the projects {userName} has created or contributed to.
        </p>
      </div>
      <div>
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} fullName={userName} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsGrid;
