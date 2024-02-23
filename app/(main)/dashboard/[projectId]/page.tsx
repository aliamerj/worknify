import { databaseDrizzle } from "@/db/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TaskMangementPage } from "../_component/task_mangement_page/task_mangement_page";
import { parseInt } from "lodash";
import { notFound } from "next/navigation";
import { DashboardProvider } from "../context/context_dashboard";
export interface DevInfo {
  id: string;
  image: string;
  name: string;
  email: string;
}
interface Props {
  params: { projectId: string };
  searchParams: { feature?: string };
}
export default async function DashboardPage({ params, searchParams }: Props) {
  // Retrieve session using authOptions
  const session = await getServerSession(authOptions);

  // Retrieve project from database
  const projectId = parseInt(params.projectId);
  const project = await databaseDrizzle.query.project.findFirst({
    where: (p, o) => o.eq(p.id, projectId),
  });

  // Return 404 error if project is not found
  if (!project) {
    return notFound();
  }

  // Retrieve features associated with the project
  const features = await databaseDrizzle.query.feature.findMany({
    where: (f, o) => o.eq(f.projectId, projectId),
  });

  // Retrieve developer IDs associated with the project
  const devIds = await databaseDrizzle.query.dev.findMany({
    where: (d, o) => o.eq(d.projectId, projectId),
    columns: {
      devId: true,
    },
  });

  // Retrieve information about the developers
  const contributers = [project.owner, ...devIds.map((d) => d.devId)];
  const devsInfo = await getDevsInfo(contributers);

  // Check if the current user is the owner of the project
  const isOwner = session?.user.id === project?.owner ? session?.user.id : null;

  // Check if the current user is a developer associated with the project
  const isDev = session?.user.id && devIds.find((d) => d.devId === session.user.id)?.devId;

  // Retrieve all tasks associated with the project
  const selectedFeatureId = parseInt(searchParams.feature ?? "");
  const allTasks = await databaseDrizzle.query.tasks.findMany({
    where: (t, o) => o.eq(t.projectId, projectId),
  });

  // Return JSX element rendering TaskMangementPage component wrapped in DashboardProvider component
  return (
    <DashboardProvider
      initialData={{
        project,
        features,
        allTasks,
        devsInfo,
        isOwner,
        isDev,
        featureId: selectedFeatureId,
      }}
    >
      <TaskMangementPage featureId={selectedFeatureId} />
    </DashboardProvider>
  );
}
async function getDevsInfo(contributers: string[]): Promise<DevInfo[]> {
  const devs = contributers.map(async (contributer) => {
    const name = await databaseDrizzle.query.profile.findFirst({
      where: (p, o) => o.eq(p.userId, contributer),
      columns: {
        fullName: true,
      },
    });
    const userInfo = await databaseDrizzle.query.users.findFirst({
      where: (u, o) => o.eq(u.id, contributer),
      columns: {
        image: true,
        email: true,
      },
    });
    if (!userInfo) return null;
    return {
      id: contributer,
      image: userInfo?.image,
      name: name?.fullName ?? "Alix",
      email: userInfo.email,
    };
  });

  // Use Promise.all to wait for all promises to resolve and then filter out null values.
  const resolvedDevs = await Promise.all(devs);
  const filteredDevs = resolvedDevs.filter(
    (dev): dev is DevInfo => dev !== null,
  );

  return filteredDevs;
}
