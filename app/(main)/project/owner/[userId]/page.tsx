import { databaseDrizzle } from "@/db/database";
import { eq } from "drizzle-orm";
import React from "react";
import ProjectsGrid from "../../_components/projects_grid/projects_grid";
import { notFound } from "next/navigation";

interface Props {
  params: { userId: string };
}
const MyProjectsPage = async ({ params: { userId } }: Props) => {
  const projects = await databaseDrizzle.query.project.findMany({
    where: (p) => eq(p.owner, userId),
    columns: {
      id: true,
      name: true,
      owner: true,
      compilation: true,
      startDate: true,
      endDate: true,
      type: true,
      link: true,
      logo: true,
      projectGoal: true,
    },
  });
  if (projects.length === 0) return notFound();
  const userName = await databaseDrizzle.query.profile.findFirst({
    where: (p) => eq(p.userId, userId),
    columns: {
      fullName: true,
    },
  });
  if (!userName) return notFound();

  return <ProjectsGrid projects={projects} userName={userName.fullName} />;
};

export default MyProjectsPage;
