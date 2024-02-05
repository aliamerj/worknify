import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { databaseDrizzle } from "@/db/database";
import { and, eq } from "drizzle-orm";
import { parseInt } from "lodash";
import { getServerSession } from "next-auth";
import React from "react";

import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { Spinner } from "@nextui-org/react";

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
const EditProjectPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  const projectId = parseInt(params.id);
  const project = await databaseDrizzle.query.project.findFirst({
    where: (p) => and(eq(p.owner, session?.user.id!), eq(p.id, projectId)),
  });
  if (!project) return notFound();

  return (
    <div>
      <ProjectForm project={project} userId={session?.user.id!} />
    </div>
  );
};
export default EditProjectPage;
