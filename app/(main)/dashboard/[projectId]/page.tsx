import { databaseDrizzle } from "@/db/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TaskMangementPage } from "../_component/task_mangement_page/task_mangement_page";
import { parseInt } from "lodash";
import { notFound } from "next/navigation";
import { DashboardProvider } from "../context/dashboard_context";
import NotAllowedPage from "../../project/_components/not_allowed/not_allowed";

interface Props {
  params: { projectId: string };
  searchParams: { feature?: string };
}
export default async function DashboardPage({ params, searchParams }: Props) {
  // Retrieve session using authOptions
  const session = await getServerSession(authOptions);

  const selectedFeatureId = parseInt(searchParams.feature ?? "");
  // Retrieve project from database
  const projectId = parseInt(params.projectId);
  const project = await databaseDrizzle.query.project.findFirst({
    where: (p, o) => o.eq(p.id, projectId,),
    with: {
      creator: {
        columns: {
          id: true,
          image: true,
          email: true,
          name: true,
        },
      },
      features: {
        with: {
          tasks: true,
        },
      },
      devs: {
        columns: {},
        with: {
          contributor: {
            columns: {
              id: true,
              image: true,
              email: true,
              name: true,
            },
          },
        },
      },
    },
  });
  // Return 404 error if project is not found
  if (!project) {
    return notFound();
  }
    if(project.type === 'private' && project.owner === session?.user || project.devs.find(d =>d.contributor.id === session?.user.id)) return <NotAllowedPage/>
  // Check if the current user is the owner of the project
  const isOwner =
    session?.user.id === project?.owner ? session?.user.id : undefined;

  // Check if the current user is a developer associated with the project
  const isDev =
    session?.user.id &&
    project.devs.find((d) => d.contributor.id === session.user.id)?.contributor
      .id;

  // Return JSX element rendering TaskMangementPage component wrapped in DashboardProvider component
  return (
    <DashboardProvider project={project} isDev={isDev} isOwner={isOwner}>
      <TaskMangementPage
        project={project}
        isOwner={isOwner}
        featureId={selectedFeatureId}
      />
    </DashboardProvider>
  );
}
