import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { databaseDrizzle } from "@/db/database";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import ProjectHeader from "../../_components/_view_section/project_header/project_header";

import NotAllowedPage from "../../_components/not_allowed/not_allowed";
import { ProjectBody } from "../../_components/_view_section/project_body/project_body";
import { ProjectSchema } from "@/utils/validations/projectValidation";
import getTableCount from "@/utils/api_handler/get_table_count";
import { calcCompletionUnified } from "@/utils/helper_function";
import { Metadata, ResolvingMetadata } from "next";

interface Props {
  params: { id: string };
}

const notFoundMetadata: Metadata = {
  title: "Project Not Found - Worknify",
  description:
    "The project you are looking for does not exist or is no longer available on Worknify. Discover other projects or explore our platform to connect with professionals, manage your tasks, or create your own project.",
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const projectId = parseInt(params.id);
  if (!projectId) return notFoundMetadata;

  const project = await databaseDrizzle.query.project.findFirst({
    where: (p, o) => o.eq(p.id, projectId),
    columns: {
      name: true,
      projectGoal: true,
      logo: true,
    },
  });
  if (!project) return notFoundMetadata;
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: `Project: ${project.name} - Worknify`,
    description: project.projectGoal,
    openGraph: {
      images: [project.logo ?? "", ...previousImages],
    },
  };
}
export default async function ProjectViewPage({ params }: Props) {
  const projectId = parseInt(params.id);
  const session = await getServerSession(authOptions);
  const project = await databaseDrizzle.query.project.findFirst({
    where: (p, o) => o.eq(p.id, projectId),
    with: {
      features: {
        where: (f, o) => o.eq(f.includeFeature, true),
        columns: {
          id: true,
          featureName: true,
          description: true,
          startDate: true,
          endDate: true,
        },
        with: {
          tasks: {
            columns: {
              status: true,
            },
          },
        },
      },
      stars: session?.user.id
        ? {
            where: (s, o) => o.eq(s.userId, session?.user.id!),
            columns: {
              userId: true,
            },
          }
        : undefined,
      devs: session?.user.id
        ? {
            where: (d, o) => o.eq(d.devId, session?.user.id!),
            columns: {
              devId: true,
            },
          }
        : undefined,
      notifications: session?.user.id
        ? {
            where: (n, o) =>
              o.and(
                o.eq(n.senderId, session?.user.id!),
                o.eq(n.notificationType, "JOIN_REQUEST"),
              ),
            columns: {
              id: true,
            },
          }
        : undefined,
    },
  });
  if (!project) return notFound();
  const isDev = project?.devs
    ? project.devs.find((d) => d.devId === session?.user.id)?.devId
    : null;
  if (project.type === "private") {
    if (project.owner !== session?.user.id && !isDev) {
      return <NotAllowedPage />;
    }
  }
  const starCount = await getTableCount(
    "star_project",
    "project_id",
    projectId,
  );
  const devCount = await getTableCount("dev", "project_id", projectId);
  const isStared = project?.stars ? project.stars[0]?.userId : null;
  const completion = calcCompletionUnified(project.features);
  let isWaiting: { id: number } | undefined = project?.notifications
    ? project?.notifications[0]
    : undefined;

  return (
    <>
      <ProjectHeader
        isAuth={!!session?.user.id}
        isWaiting={!!isWaiting}
        isJoined={project.owner === session?.user.id || !!isDev}
        owner={project.owner}
        isCreater={project.owner === session?.user.id}
        projectId={projectId}
        starsCount={starCount}
        stared={!!isStared}
        projectName={project.name}
        projectGoal={project.projectGoal}
        projectLogo={project.logo}
        projectType={project.type as ProjectSchema["type"]}
      />
      <ProjectBody
        project={project}
        devCount={devCount}
        completion={completion}
        features={project.features}
      />
    </>
  );
}
