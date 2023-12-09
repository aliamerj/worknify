import { getServerSession } from "next-auth";
import { ProfileDataProvider } from "./profile_context";
import { ProfileDisplay } from "./profile_display";
import { ProfileForm } from "./profile_form";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MainButtons } from "./main_buttons";

export default async function CreateProfile() {
  const session = await getServerSession(authOptions);
  return (
    <ProfileDataProvider
      name={session?.user?.name ?? ""}
      email={session?.user?.email ?? ""}
    >
      <main className="mt-5 flex flex-col gap-2 lg:flex-row lg:justify-evenly lg:py-5">
        <div className="w-full lg:w-5/12">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground lg:pt-9">
            Create your profile
          </h2>
          <ProfileForm />
        </div>
        <div className="mt-4 w-full px-4 py-4 lg:mt-0 lg:w-6/12">
          <ProfileDisplay userId={session?.user.id!} />
        </div>
      </main>
      <MainButtons />
    </ProfileDataProvider>
  );
}
