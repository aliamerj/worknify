import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { databaseDrizzle } from "@/db/database";
import { eq, inArray, or } from "drizzle-orm";
import { getServerSession } from "next-auth";
import React from "react";
import NotAllowedPage from "../_components/not_allowed/not_allowed";
import ProjectsGrid from "../_components/projects_grid/projects_grid";

const MyProjectsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) return <NotAllowedPage />;
  const devs = await databaseDrizzle.query.dev.findMany({
    where: (d) => eq(d.devId, session.user.id!),
  });
  const projectIds = devs.map((p) => p.projectId);

  var myProjects;
  if (projectIds.length > 0) {
    myProjects = await databaseDrizzle.query.project.findMany({
      where: (p) =>
        or(eq(p.owner, session.user.id!), inArray(p.id, projectIds)),
    });
  } else {
    myProjects = await databaseDrizzle.query.project.findMany({
      where: (p) => eq(p.owner, session.user.id!),
    });
  }

  return <ProjectsGrid projects={myProjects} />;
};

export default MyProjectsPage;
