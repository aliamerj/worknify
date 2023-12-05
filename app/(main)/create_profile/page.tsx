import { getServerSession } from "next-auth";
import { ProfileDataProvider } from "./profile_context";
import { ProfileDisplay } from "./profile_display";
import { ProfileForm } from "./profile_form";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function CreateProfile() {
  const session = await getServerSession(authOptions);
  return (
    <ProfileDataProvider
      name={session?.user?.name ?? ""}
      email={session?.user?.email ?? ""}
    >
      <main className="mt-5 gap-2 sm:flex sm:justify-center md:flex md:justify-between md:py-5">
        <div className="w-full md:w-5/12 ">
          <h2 className="my-5 mb-4 text-center text-3xl font-bold text-foreground md:pt-9">
            Create your profile
          </h2>
          <ProfileForm />
        </div>
        <div className="mt-4 w-full bg-red-200 px-4 py-4 md:mt-0 md:w-6/12 ">
          <ProfileDisplay />
        </div>
      </main>
    </ProfileDataProvider>
  );
}
