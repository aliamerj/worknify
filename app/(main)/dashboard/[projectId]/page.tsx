import { databaseDrizzle } from "@/db/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TaskMangementPage } from "../_component/task_mangement_page/task_mangement_page";

interface Props {
  params: { projectId: string };
}
export default async function DashboardPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const id = parseInt(params.projectId);
  const features = await databaseDrizzle.query.feature.findMany({
    where: (f, o) => o.eq(f.projectId, id),
  });
  const project = await databaseDrizzle.query.project.findFirst({
    where: (p, o) => o.eq(p.id, id),
  });
  const isOwner = session?.user.id === project?.owner;

  return (
    <TaskMangementPage
      features={features}
      projectId={id}
      isOwner={isOwner}
      projectName={project?.name!}
      projectComplation={project?.compilation!}
      projectGoal={project?.projectGoal!}
      projectLogo={project?.logo ?? undefined}
    />
  );
}
