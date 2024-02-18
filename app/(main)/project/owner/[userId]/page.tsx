import { databaseDrizzle } from "@/db/database";

import React from "react";
import ProjectsGrid from "../../_components/projects_grid/projects_grid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Noprojects } from "../../_components/no_projects/no_projects";

interface Props {
  params: { userId: string };
}
const MyProjectsPage = async ({ params: { userId } }: Props) => {
  const session = await getServerSession(authOptions);

  const contributors = await databaseDrizzle.query.dev
    .findMany({
      where: (d, o) => o.eq(d.devId, userId),
      columns: {
        projectId: true,
      },
    })
    .then((res) => res.map((res) => res.projectId));

  const projects = await databaseDrizzle.query.project.findMany({
    where: (p, o) =>
      o.or(o.eq(p.owner, userId), o.inArray(p.id, [...contributors, 10000])),
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

  const userName = await databaseDrizzle.query.profile.findFirst({
    where: (p, o) => o.eq(p.userId, userId),
    columns: {
      fullName: true,
    },
  });
  const isCurrentUser = userId === session?.user.id;

  if (projects.length === 0 || !userName)
    return (
      <Noprojects isCurrentUser={isCurrentUser} userName={userName?.fullName} />
    );

  return <ProjectsGrid projects={projects} userName={userName.fullName} />;
};

export default MyProjectsPage;
