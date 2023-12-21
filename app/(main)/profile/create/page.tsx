import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { ProfileDataProvider } from "../_components/profile_context";
import { ProfileForm } from "../_components/profile_form";
import { ProfileDisplay } from "../_components/profile_display";
import { CreateButtons } from "../_components/create_buttons";
import { databaseDrizzle } from "@/db/database";
export default async function CreateProfile() {
  const session = await getServerSession(authOptions);
  const getProfile = session
    ? await databaseDrizzle.query.profile.findFirst({
        where: (p, apt) => apt.eq(p.userId, session?.user.id!),
      })
    : null;

  return (
    <ProfileDataProvider
      name={session?.user?.name ?? ""}
      email={session?.user?.email ?? ""}
      profile={getProfile}
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
      <CreateButtons />
    </ProfileDataProvider>
  );
}
