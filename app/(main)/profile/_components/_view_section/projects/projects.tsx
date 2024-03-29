import React from "react";
import { Slide } from "@/animation/Slide";
import {
  IProjectCard,
  ProjectCard,
} from "@/app/(main)/components/project_card/project_card";

interface ProjectsProps {
  projects: IProjectCard[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  return (
    <section className="mx-12 mt-32">
      <Slide delay={0.16}>
        <div className="mb-16">
          <h1 className="font-incognito mb-8 text-4xl font-bold leading-tight tracking-tighter text-gray-800 dark:text-white md:text-5xl">
            Projects
          </h1>
        </div>
      </Slide>

      <Slide delay={0.18}>
        <div className="grid grid-cols-1 place-items-center gap-x-12 gap-y-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project, index) => (
            <ProjectCard {...project} key={index} />
          ))}
        </div>
      </Slide>
    </section>
  );
};
