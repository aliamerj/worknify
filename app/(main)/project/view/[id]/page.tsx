import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { databaseDrizzle } from "@/db/database";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import ProjectHeader from "../../_components/_view_section/project_header/project_header";
import { ProjectBody } from "../../_components/_view_section/project_header/project_body";
import NotAllowedPage from "../../_components/not_allowed/not_allowed";

interface Props {
  params: { id: string };
}
export default async function ProjectViewPage({ params }: Props) {
  const project = await databaseDrizzle.query.project.findFirst({
    where: (p) => eq(p.id, Number(params.id)),
  });
  if (!project) return notFound();
  const devs = await databaseDrizzle.query.dev.findMany({
    where: (d) => eq(d.projectId, Number(params.id)),
  });

  if (project.type === "private") {
    const sesstion = await getServerSession(authOptions);
    if (!sesstion || !sesstion.user.id) return notFound();

    const isDev = devs.find((d) => d.devId === sesstion.user.id);
    if (project.owner !== sesstion.user.id && !isDev) {
      return <NotAllowedPage />;
    }
  }
  return (
    <>
      <ProjectHeader
        projectName={project.name}
        projectGoal={project.projectGoal}
        projectLogo={project.logo}
      />
      <ProjectBody project={project} devs={devs} />
    </>
  );
}
