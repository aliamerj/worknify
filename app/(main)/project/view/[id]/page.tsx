import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { databaseDrizzle } from "@/db/database";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import ProjectHeader from "../../_components/_view_section/project_header/project_header";

import NotAllowedPage from "../../_components/not_allowed/not_allowed";
import { ProjectBody } from "../../_components/_view_section/project_body/project_body";
import { ProjectSchema } from "@/utils/validations/projectValidation";

interface Props {
  params: { id: string };
}
export default async function ProjectViewPage({ params }: Props) {
  const projectId = parseInt(params.id);
  const project = await databaseDrizzle.query.project.findFirst({
    where: (p) => eq(p.id, projectId),
  });
  if (!project) return notFound();
  const sesstion = await getServerSession(authOptions);
  const devs = await databaseDrizzle.query.dev.findMany({
    where: (d) => eq(d.projectId, projectId),
  });

  const isDev = devs.find((d) => d.devId === sesstion?.user.id);
  const stars = await databaseDrizzle.query.starProject.findMany({
    where: (s) => eq(s.projectId, projectId),
  });
  const isStared = stars.find((s) => s.userId === sesstion?.user.id);

  if (project.type === "private") {
    if (!sesstion || !sesstion.user.id) return notFound();
    if (project.owner !== sesstion.user.id && !isDev) {
      return <NotAllowedPage />;
    }
  }
  const isWaiting = await databaseDrizzle.query.notification.findFirst({
    where: (n) =>
      and(
        eq(n.senderId, sesstion?.user.id!),
        eq(n.receiverId, project.owner),
        eq(n.notificationType, "JOIN_REQUEST"),
        eq(n.projectId, projectId),
      ),
  });
  return (
    <>
      <ProjectHeader
        isWaiting={!!isWaiting}
        isJoined={project.owner === sesstion?.user.id || !!isDev}
        owner={project.owner}
        isCreater={project.owner === sesstion?.user.id}
        projectId={projectId}
        starsCount={stars.length}
        stared={!!isStared}
        projectName={project.name}
        projectGoal={project.projectGoal}
        projectLogo={project.logo}
        projectType={project.type as ProjectSchema["type"]}
      />
      <ProjectBody project={project} devs={devs} />
    </>
  );
}
