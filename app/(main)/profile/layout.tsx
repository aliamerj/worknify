import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getProfileData from "@/utils/api_handler/profile_handler";
import { getServerSession } from "next-auth";
import { ProfileDataProvider } from "./_components/profile_context";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const allProfiledata = session
    ? await getProfileData(session?.user.id!)
    : null;
  return (
    <ProfileDataProvider
      userId={session?.user.id ?? ""}
      name={session?.user?.name ?? ""}
      email={session?.user?.email ?? ""}
      allProfileData={allProfiledata}
    >
      {" "}
      {children}
    </ProfileDataProvider>
  );
}
