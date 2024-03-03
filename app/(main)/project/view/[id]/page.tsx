import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { databaseDrizzle } from "@/db/database";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import ProjectHeader from "../../_components/_view_section/project_header/project_header";

import NotAllowedPage from "../../_components/not_allowed/not_allowed";
import { ProjectBody } from "../../_components/_view_section/project_body/project_body";
import { ProjectSchema } from "@/utils/validations/projectValidation";
import getTableCount from "@/utils/api_handler/get_table_count";
import { calculateProjectCompletion } from "@/utils/helper_function";

interface Props {
  params: { id: string };
}
export default async function ProjectViewPage({ params }: Props) {
  const projectId = parseInt(params.id);
  const session = await getServerSession(authOptions);
  const project = await databaseDrizzle.query.project.findFirst({
    where: (p, o) => o.eq(p.id, projectId),
    with: {
      features: {
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
  const starCount = await getTableCount("star_project");
  const devCount = await getTableCount("dev");
  const isDev = project?.devs ? project.devs[0]?.devId : null;
  const isStared = project?.stars ? project.stars[0]?.userId : null;
  const completion = calculateProjectCompletion(project.features);

  if (project.type === "private") {
    if (!session || !session.user.id) return notFound();
    if (project.owner !== session.user.id && !isDev) {
      return <NotAllowedPage />;
    }
  }
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
