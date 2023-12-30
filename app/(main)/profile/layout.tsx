import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getProfileData from "@/utils/api_handler/profile_handler";
import { getServerSession } from "next-auth";
import { ProfileDataProvider } from "./_components/profile_context";
import { headers } from "next/headers";
import { AppRouter } from "@/utils/router/app_router";
export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  var session = null;
  var allProfiledata = null;
  const pathname = headersList.get("x-pathname");
  if (!pathname?.includes(AppRouter.viewProfile)) {
    session = await getServerSession(authOptions);
    allProfiledata = session ? await getProfileData(session?.user.id!) : null;
  }
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
