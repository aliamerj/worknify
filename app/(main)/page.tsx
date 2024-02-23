import { Features } from "./components/features/features";
import { Header } from "./components/header/Header";
import { ProjectsBox } from "./components/projects_box/projects_box";

export default function Home() {


  return (
    <main>
      <Header />
      <ProjectsBox/>
      <Features/>
    </main>
  );
}
