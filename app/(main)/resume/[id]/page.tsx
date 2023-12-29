import { databaseDrizzle } from "@/db/database";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { Header } from "../_components/header/header";
import { ProfileSummary } from "../_components/profile_summary/profile_summary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Experience } from "../_components/experience/experience";
import ShimmerLoading from "@/global-components/ShimmerLoading";
import ErrorBoundary from "@/global-components/ErrorBoundary";
import { Spinner } from "@nextui-org/react";

interface Props {
  params: { id: string };
}
async function ViewProfile({ params }: Props) {
  const sesstion = await getServerSession(authOptions);
  var id = sesstion?.user.id;
  var image = sesstion?.user.image;
  if (!sesstion || id !== params.id) {
    const user = await databaseDrizzle.query.users.findFirst({
      where: (u, o) => o.or(o.eq(u.id, params.id), o.eq(u.username, params.id)),
    });
    if (!user) return notFound();
    id = user.id;
    image = user.image;
  }

  const profile = await databaseDrizzle.query.profile.findFirst({
    where: (p, o) => o.eq(p.userId, id!),
  });

  if (!profile) notFound();
  return (
    <>
      <Header
        fullName={profile.fullName}
        username={params.id}
        background={profile.background}
        image={image ?? null}
        linkedin={profile.linkedin}
        github={profile.github}
        jobTitle={profile.jobTitle}
      />
      <ErrorBoundary>
        <Suspense fallback={<ShimmerLoading count={4} />}>
          <ProfileSummary />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<ShimmerLoading count={4} />}>
          <Experience profileId={profile.id} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default ViewProfile;
