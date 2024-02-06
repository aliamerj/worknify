import { databaseDrizzle } from "@/db/database";
import { Sidebar } from "../_component/left_slider/side_bar";

interface Props {
  params: { projectId: string };
}
export default async function DashboardPage({ params }: Props) {
  const id = parseInt(params.projectId);
  const features = await databaseDrizzle.query.feature.findMany({
    where: (f, o) => o.eq(f.projectId, id),
  });

  return (
    <div>
      <Sidebar currentFeatures={features} projectId={id} />
      <h1>hello word, {params.projectId}</h1>
    </div>
  );
}
