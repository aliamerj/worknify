import { LeftSlider } from "../_component/left_slider/left_slider";

interface Props {
  params: { projectId: string };
}
export default async function DashboardPage({ params }: Props) {
  return (
    <div>
      <LeftSlider />
      <h1>hello word, {params.projectId}</h1>
    </div>
  );
}
