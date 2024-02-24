import { Features } from "./components/features/features";
import { Header } from "./components/header/Header";
import { ProjectsBox } from "./components/projects_box/projects_box";

interface props {
  searchParams: {
    visibility: string;
    page: string;
  };
}

export default function Home({ searchParams }: props) {
  return (
    <main>
      <Header />
      <ProjectsBox
        visibility={searchParams.visibility}
        currentPage={searchParams.page}
      />
      <Features />
    </main>
  );
}
