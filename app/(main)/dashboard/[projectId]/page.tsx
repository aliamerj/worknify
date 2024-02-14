import { databaseDrizzle } from "@/db/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TaskMangementPage } from "../_component/task_mangement_page/task_mangement_page";
import { parseInt } from "lodash";
import { notFound } from "next/navigation";
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
  const session = await getServerSession(authOptions);
  const id = parseInt(params.projectId);

  const project = await databaseDrizzle.query.project.findFirst({
    where: (p, o) => o.eq(p.id, id),
  });
  if (!project) return notFound();

  const features = await databaseDrizzle.query.feature.findMany({
    where: (f, o) => o.eq(f.projectId, id),
  });
  const devIds = await databaseDrizzle.query.dev.findMany({
    where: (d, o) => o.eq(d.projectId, id),
    columns: {
      devId: true,
    },
  });
  const contributers = [project.owner, ...devIds.map((d) => d.devId)];

  const devsInfo = await getDevsInfo(contributers);

  const isOwner = session?.user.id === project?.owner;

  return (
    <TaskMangementPage
      selectedFeatureId={searchParams.feature}
      features={features}
      projectId={id}
      isOwner={isOwner}
      projectName={project.name}
      projectComplation={project.compilation}
      projectGoal={project.projectGoal}
      projectLogo={project.logo}
      devsInfo={devsInfo}
    />
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
    if (!userInfo || !name) return null;
    return {
      id: contributer,
      image: userInfo?.image,
      name: name.fullName,
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
