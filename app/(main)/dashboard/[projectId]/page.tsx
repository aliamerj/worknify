import { databaseDrizzle } from "@/db/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Sidebar } from "../_component/left_slider/side_bar";

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
    <div>
      <Sidebar currentFeatures={features} projectId={id} isOwner={isOwner} />
      <h1>hello word, {params.projectId}</h1>
    </div>
  );
}
