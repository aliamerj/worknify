import { getServerSession } from "next-auth";
import ProjectForm from "../_components/project_form/project_form";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { databaseDrizzle } from "@/db/database";
import NotAllowedPage from "../_components/not_allowed/not_allowed";
import { AppRouter } from "@/utils/router/app_router";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Project - Worknify: Transform Your Ideas into Reality",
  description:
    "Kickstart your next venture on Worknify by creating a new project. Define your goals, outline your plan, select your team, and set the stage for success. Our intuitive platform simplifies project creation, making it easy to bring your innovative ideas to life and collaborate effectively.",
};
const CreateProject = async () => {
  const sesstion = await getServerSession(authOptions);
  if (!sesstion?.user.id) return <NotAllowedPage />;

  const profile = await databaseDrizzle.query.users.findFirst({
    where: (u, o) => o.eq(u.id, sesstion.user.id!),
    columns: {
      profileId: true,
    },
  });

  if (!profile?.profileId)
    return (
      <NotAllowedPage
        message="You should have profile first, to create project"
        textBtn="Create Profile"
        linkBtn={AppRouter.createProfile}
      />
    );

  return (
    <>
      <ProjectForm />
    </>
  );
};
export default CreateProject;
