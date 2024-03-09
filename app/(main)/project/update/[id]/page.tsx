import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { databaseDrizzle } from "@/db/database";
import { and, eq } from "drizzle-orm";
import { parseInt } from "lodash";
import { getServerSession } from "next-auth";
import React from "react";

import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { Spinner } from "@nextui-org/react";
import { Metadata } from "next";

const ProjectForm = dynamic(
  () => import("@/app/(main)/project/_components/project_form/project_form"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    ),
  },
);

interface Props {
  params: { id: string };
}

const notFoundMetadata: Metadata = {
  title: "Project Not Found - Worknify",
  description:
    "The project you are looking for does not exist or is no longer available on Worknify. Discover other projects or explore our platform to connect with professionals, manage your tasks, or create your own project.",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const projectId = parseInt(params.id);
  if (!projectId) return notFoundMetadata;

  const project = await databaseDrizzle.query.project.findFirst({
    where: (p, o) => o.eq(p.id, projectId),
    columns: {
      name: true,
    },
  });
  if (!project) return notFoundMetadata;

  return {
    title: `Update Your Project: ${project.name} - Worknify`,
    description: `Revise and optimize your project, ${project.name}, on Worknify. Update your project's goals, timeline, team roles, and more to keep your project aligned with your objectives. Ensure your project stays relevant and on track for success.`,
  };
}

const EditProjectPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  const projectId = parseInt(params.id);
  const project = await databaseDrizzle.query.project.findFirst({
    where: (p) => and(eq(p.owner, session?.user.id!), eq(p.id, projectId)),
  });
  if (!project) return notFound();

  return (
    <div>
      <ProjectForm project={project} />
    </div>
  );
};
export default EditProjectPage;
