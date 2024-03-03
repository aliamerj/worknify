import { databaseDrizzle } from "@/db/database";

import React from "react";
import ProjectsGrid, {
  ProjectProps,
} from "../../_components/projects_grid/projects_grid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Noprojects } from "../../_components/no_projects/no_projects";

interface Props {
  params: { userId: string };
}
const MyProjectsPage = async ({ params: { userId } }: Props) => {
  const session = await getServerSession(authOptions);

  const isCurrentUser = userId === session?.user.id;

  const myData = await databaseDrizzle.query.users.findFirst({
    where: (d, o) => o.eq(d.id, userId),
    columns: {},
    with: {
      profile: {
        columns: {
          fullName: true,
        },
      },
      contributions: {
        columns: {},
        with: {
          project: {
            columns: {
              id: true,
              name: true,
              owner: true,
              startDate: true,
              endDate: true,
              type: true,
              link: true,
              logo: true,
              projectGoal: true,
            },
            with: {
              features: {
                columns: {},
                with: {
                  tasks: {
                    columns: {
                      status: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      projects: {
        columns: {
          id: true,
          name: true,
          owner: true,
          startDate: true,
          endDate: true,
          type: true,
          link: true,
          logo: true,
          projectGoal: true,
        },
        with: {
          features: {
            columns: {},
            with: {
              tasks: {
                columns: {
                  status: true,
                },
              },
            },
          },
        },
      },
    },
  });

  let projects: ProjectProps[] = myData?.projects || [];
  const projectsContributed: ProjectProps[] =
    myData?.contributions?.map((c) => c.project) || [];
  if (projectsContributed.length > 0) {
    projects = [...projects, ...projectsContributed];
  }
  if (projects.length === 0 || !myData?.profile?.fullName)
    return (
      <Noprojects
        isCurrentUser={isCurrentUser}
        userName={myData?.profile?.fullName}
      />
    );

  return (
    <ProjectsGrid projects={projects} userName={myData.profile.fullName} />
  );
};

export default MyProjectsPage;
