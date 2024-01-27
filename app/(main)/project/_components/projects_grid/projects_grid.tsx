import { ProjectSelection } from "@/db/schemes/projectSchema";
import { ProjectCard } from "../project_card/project_card";

const ProjectsGrid = ({ projects }: { projects: ProjectSelection[] }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">My Projects</h1>
        <p className="mt-2 text-gray-600">
          Browse through the projects you've created or contributed to.
        </p>
      </div>
      <div>
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsGrid;
