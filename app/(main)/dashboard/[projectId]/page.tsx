import { databaseDrizzle } from "@/db/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TaskMangementPage } from "../_component/task_mangement_page/task_mangement_page";
import { parseInt } from "lodash";
import { notFound } from "next/navigation";
import { DashboardProvider } from "../context/dashboard_context";
import NotAllowedPage from "../../project/_components/not_allowed/not_allowed";
import { FeatureSelection } from "@/db/schemes/featureSchema";
import { TaskSelection } from "@/db/schemes/taskSchema";
import { ProjectSelection } from "@/db/schemes/projectSchema";
import { Metadata, ResolvingMetadata } from "next";

interface Props {
  params: { projectId: string };
  searchParams: { feature?: string };
}
const generalDashboardMetadata: Metadata = {
  title: "Dashboard - Worknify: Manage Your Projects Efficiently",
  description:
    "Access your Worknify dashboard to seamlessly create, update, and delete project features, manage tasks, and streamline your project management processes. Our user-friendly dashboard empowers you to take control of your projects and enhance productivity.",
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  // read route params
  const id = parseInt(searchParams.feature ?? "");
  if (!id) return generalDashboardMetadata;

  const feature = await databaseDrizzle.query.feature.findFirst({
    where: (f, o) => o.eq(f.id, id),
  });

  if (!feature) return generalDashboardMetadata;

  return {
    title: feature.featureName,
    description: feature.description,
  };
}

export interface DevInfo {
  id: string;
  image: string | null;
  name: string | null;
  email: string;
}
export interface FeatureQuery extends FeatureSelection {
  tasks?: TaskSelection[];
}
export interface ProjectQuery extends ProjectSelection {
  features: FeatureQuery[];
  devs?: Array<{
    contributor: DevInfo;
  }>;
  creator: DevInfo;
}
export default async function DashboardPage({ params, searchParams }: Props) {
  // Retrieve session using authOptions
  const session = await getServerSession(authOptions);

  const selectedFeatureId = parseInt(searchParams.feature ?? "");
  // Retrieve project from database
  const projectId = parseInt(params.projectId);
  const project: ProjectQuery | undefined =
    await databaseDrizzle.query.project.findFirst({
      where: (p, o) => o.eq(p.id, projectId),
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

  // Check if the current user is the owner of the project
  const isOwner =
    session?.user.id === project?.owner ? session?.user.id : undefined;

  // Check if the current user is a developer associated with the project
  const isDev =
    session?.user.id &&
    project.devs?.find((d) => d.contributor.id === session?.user.id)
      ?.contributor.id;

  if (project.type === "private") {
    if (!isOwner || !isDev) {
      return <NotAllowedPage />;
    }
  }
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
