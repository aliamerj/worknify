import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { databaseDrizzle } from "@/db/database";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import ProjectHeader from "../../_components/_view_section/project_header/project_header";

import NotAllowedPage from "../../_components/not_allowed/not_allowed";
import { ProjectBody } from "../../_components/_view_section/project_body/project_body";

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
  return (
    <>
      <ProjectHeader
        isJoined={project.owner === sesstion?.user.id || !!isDev}
        projectId={projectId}
        starsCount={stars.length}
        stared={!!isStared}
        projectName={project.name}
        projectGoal={project.projectGoal}
        projectLogo={project.logo}
      />
      <ProjectBody project={project} devs={devs} />
    </>
  );
}
