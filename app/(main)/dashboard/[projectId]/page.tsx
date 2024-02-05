import { Sidebar } from "../_component/left_slider/side_bar";

interface Props {
  params: { projectId: string };
}
export default async function DashboardPage({ params }: Props) {
  return (
    <div>
      <Sidebar />
      <h1>hello word, {params.projectId}</h1>
    </div>
  );
}
