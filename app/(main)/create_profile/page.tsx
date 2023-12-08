import { getServerSession } from "next-auth";
import { ProfileDataProvider } from "./profile_context";
import { ProfileDisplay } from "./profile_display";
import { ProfileForm } from "./profile_form";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { Button } from "@nextui-org/react";

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
      <div className="fixed inset-x-0 bottom-0 mb-4 flex justify-center">
        <div className="mx-auto flex gap-4 rounded-md bg-content4 px-5 py-4">
          {/* Button 1 */}
          <button className="rounded-md bg-primary px-6 py-2 text-white hover:bg-blue-600">
            Save Data
          </button>

          {/* Button 2 */}
          <Button
            as={Link}
            href="/"
            variant="flat"
            className="rounded-md border-content1 bg-white px-6 py-2 text-content1"
          >
            Later
          </Button>
        </div>
      </div>
    </ProfileDataProvider>
  );
}
