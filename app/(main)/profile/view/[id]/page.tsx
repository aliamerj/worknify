import { databaseDrizzle } from "@/db/database";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import ShimmerLoading from "@/global-components/ShimmerLoading";
import ErrorBoundary from "@/global-components/ErrorBoundary";
import dynamic from "next/dynamic";
import { Spinner } from "@nextui-org/react";
import { ProfileSummary } from "../../_components/_view_section/profile_summary/profile_summary";
import { Experience } from "../../_components/_view_section/experience/experience";
import { Education } from "../../_components/_view_section/education/education";
import Sections from "../../_components/_view_section/section/section";
import { Header } from "../../_components/_view_section/header/header";
import { Projects } from "../../_components/_view_section/projects/projects";
import { Noprofile } from '../../_components/_view_section/no_profile/no_profile';

const Skills = dynamic(
  () => import("@/app/(main)/profile/_components/_view_section/skills/skills"),
  {
    ssr: false,
    loading: () => (
      <div className="m-5 flex w-full items-center justify-center p-5">
        <Spinner size="lg" />
      </div>
    ),
  },
);

interface Props {
  params: { id: string };
}
async function ViewProfile({ params }: Props) {
  const session = await getServerSession(authOptions);
  var id = session?.user.id;
  var image = session?.user.image;
  if (!session || id !== params.id) {
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


  if (!profile) return <Noprofile isCurrentUser={id === params.id}/>;

  const star = await databaseDrizzle.query.star.findMany({
    where: (s, o) => o.eq(s.profileId, profile?.id),
    columns: {
      userId: true,
    },
  });
  const projects = await databaseDrizzle.query.project.findMany({
    where: (p, o) => o.eq(p.owner, params.id),
    columns: {
      id: true,
      logo: true,
      name: true,
      projectGoal: true,
      techUsed: true,
      link: true,
    },
  });
  const isStared = star.findIndex((star) => (star.userId = params.id)) !== -1;
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
        isStared={isStared}
        profileId={profile.id}
        emailUser={profile.email}
      />
      <ErrorBoundary>
        <Suspense fallback={<ShimmerLoading count={4} />}>
          <ProfileSummary
            stars={star.length}
            projects={projects.length}
            userId={params.id}
          />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<ShimmerLoading count={4} />}>
          <Experience profileId={profile.id} />
        </Suspense>
      </ErrorBoundary>
      {profile.skills && <Skills skills={profile.skills} />}
      <Projects projects={projects} />
      <ErrorBoundary>
        <Suspense fallback={<ShimmerLoading count={4} />}>
          <Education profileId={profile.id} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<ShimmerLoading count={4} />}>
          <Sections profileId={profile.id} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default ViewProfile;
