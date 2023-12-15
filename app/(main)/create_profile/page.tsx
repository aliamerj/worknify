import { getServerSession } from "next-auth";
import { ProfileDataProvider } from "./profile_context";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ProfileForm } from "./profile_form/profile_form";

export default async function CreateProfile() {
  const session = await getServerSession(authOptions);
  return (
    <ProfileDataProvider
      name={session?.user?.name ?? ""}
      email={session?.user?.email ?? ""}
    >
      <section className="py-24">
        <div className="container">
          <ProfileForm />
        </div>
      </section>
    </ProfileDataProvider>
  );
}
