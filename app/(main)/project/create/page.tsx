import { getServerSession } from "next-auth";
import { ProjectForm } from "../_components/project_form/project_form";

const CreateProject = async () => {
  const sesstion = await getServerSession();
  return (
    <>
      <ProjectForm userEmail={sesstion!.user.email!} />
    </>
  );
};
export default CreateProject;
