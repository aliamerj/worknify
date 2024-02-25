import ErrorBoundary from "@/global-components/ErrorBoundary";
import { Features } from "./components/features/features";
import { Header } from "./components/header/Header";
import { ProjectsBox } from "./components/projects_box/projects_box";
import { Suspense } from "react";
import ShimmerLoading from "@/global-components/ShimmerLoading";
import CallToActionSection from "./components/call_to_actionSection/CallToActionSection";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

interface props {
  searchParams: {
    visibility: string;
    page: string;
    search: string;
  };
}

export default async function Home({ searchParams }: props) {
  const auth = await getServerSession(authOptions);
  return (
    <main>
      <Header />
      <ErrorBoundary>
        <Suspense fallback={<ShimmerLoading count={6} />}>
          <ProjectsBox
            visibility={searchParams.visibility}
            currentPage={searchParams.page}
            search={searchParams.search}
          />
        </Suspense>
      </ErrorBoundary>
      <Features />
      {!auth?.user && <CallToActionSection />}
    </main>
  );
}
