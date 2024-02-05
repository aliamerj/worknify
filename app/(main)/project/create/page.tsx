import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ProjectForm from "../_components/project_form/project_form";
import { getServerSession } from "next-auth";

const CreateProject = async () => {
  const session = await getServerSession(authOptions);
  return (
    <>
      <ProjectForm userId={session?.user.id!} />
    </>
  );
};
export default CreateProject;
