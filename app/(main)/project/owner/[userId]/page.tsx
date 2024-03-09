import { databaseDrizzle } from "@/db/database";

import React from "react";
import ProjectsGrid, {
  ProjectProps,
} from "../../_components/projects_grid/projects_grid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Noprojects } from "../../_components/no_projects/no_projects";
import { Metadata, ResolvingMetadata } from "next";

interface Props {
  params: { userId: string };
}
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const user = await databaseDrizzle.query.users.findFirst({
    where: (d, o) => o.eq(d.id, params.userId),
    columns: {},
    with: {
      profile: {
        columns: {
          fullName: true,
        },
      },

      projects: {
        columns: {
          name: true,
        },
      },
    },
  });
  if (!user?.profile)
    return {
      title: "User Not Found - Worknify",
      description:
        "The profile you are searching for does not exist or cannot be accessed. Explore Worknify to discover other professionals, engage with projects, or enhance your own profile. Join our community to connect, collaborate, and create with peers across industries.",
    };

  if (!user.projects)
    return {
      title: "No Projects Found - Worknify",
      description: `${user.profile.fullName} has not created any projects yet on Worknify. Dive into our resources to start your first project, connect with a community of professionals, and bring your ideas to life.`,
    };

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${user.profile.fullName}'s Projects - Worknify`,
    description: `Discover ${user.profile.fullName}'s key projects on Worknify: ${user.projects
      .slice(0, 3)
      .map((project) => project.name)
      .join(
        ", ",
      )}, and more. Manage and track your project progress in a centralized hub designed for efficiency and collaboration.`,
    openGraph: {
      images: previousImages,
    },
  };
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
