import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import {
  AllProfileData,
  ProfileDataProvider,
} from "./_components/context/profile_context";
import { headers } from "next/headers";
import { AppRouter } from "@/utils/router/app_router";
import { databaseDrizzle } from "@/db/database";
/**
 * The `ProfileLayout` function is an asynchronous function that serves as a layout component for the profile page.
 * It retrieves the user's session and profile data, and provides it to the `ProfileDataProvider` component.
 *
 * param children - The child components to be rendered within the `ProfileLayout` component.
 * returns The `ProfileDataProvider` component, which wraps the child components and provides the user's session and profile data to them.
 */
export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const pathname = headersList.get("x-pathname");

  let session: any = null;
  let allProfileData: AllProfileData | undefined;

  if (!pathname?.includes(AppRouter.viewProfile)) {
    session = await getServerSession(authOptions);
    if (session) {
      allProfileData = await databaseDrizzle.query.users.findFirst({
        where: (u, o) => o.eq(u.id, session.user.id!),
        columns: {},
        with: {
          profile: {
            with: {
              experiences: true,
              educations: true,
              sections: true,
            },
          },
        },
      });
    }
  }

  return (
    <ProfileDataProvider
      userId={session?.user.id ?? ""}
      name={session?.user?.name ?? ""}
      email={session?.user?.email ?? ""}
      allProfileData={allProfileData}
    >
      {children}
    </ProfileDataProvider>
  );
}
