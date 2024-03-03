import { databaseDrizzle } from "@/db/database";
import { notFound } from "next/navigation";
import React from "react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import dynamic from "next/dynamic";
import { Spinner } from "@nextui-org/react";
import { ProfileSummary } from "../../_components/_view_section/profile_summary/profile_summary";
import { Experience } from "../../_components/_view_section/experience/experience";
import { Education } from "../../_components/_view_section/education/education";
import Sections from "../../_components/_view_section/section/section";
import { Projects } from "../../_components/_view_section/projects/projects";
import { Noprofile } from "../../_components/_view_section/no_profile/no_profile";
import { EditProfileBtn } from "../../_components/_view_section/edit_Profile_btn/edit_profile_btn";
import Header from "../../_components/_view_section/header/header";
import getTableCount from "@/utils/api_handler/get_table_count";
import { ButtonHeader } from "../../_components/_view_section/buttonsHeader/button_header";

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
/**
 * Retrieves and displays a user's profile information.
 * param params - An object containing the parameters passed to the function, including the user's ID.
 * returns The rendered profile information, including the header, summary, experience, skills, projects, education, and sections.
 */
async function ViewProfile({ params }: Props) {
  const session = await getServerSession(authOptions);

  const user = await databaseDrizzle.query.users.findFirst({
    where: (u, o) => o.eq(u.id, params.id),
    columns: {
      id: true,
      image: true,
    },
    with: {
      profile: {
        with: {
          experiences: true,
          educations: true,
          sections: true,
          stars: session?.user.id
            ? {
                where: (s, o) => o.eq(s.userId, session?.user.id!),
                columns: {
                  userId: true,
                },
              }
            : undefined,
        },
      },
      projects: {
        columns: {
          id: true,
          logo: true,
          name: true,
          projectGoal: true,
          techUsed: true,
          link: true,
        },
      },
    },
  });

  if (!user) {
    return notFound();
  }
  if (!user.profile) {
    return <Noprofile isCurrentUser={session?.user.id === params.id} />;
  }
  const { profile, projects } = user;
  const starCount = await getTableCount("profile_star");
  const isStared = user.profile?.stars ? user.profile.stars[0]?.userId : null;

  return (
    <>
      <Header
        fullName={profile.fullName}
        username={params.id}
        background={profile.background}
        image={user.image}
        linkedin={profile.linkedin}
        github={profile.github}
        jobTitle={profile.jobTitle}
        isStared={!!isStared}
        profileId={profile.id}
        emailUser={profile.email}
      >
        <ButtonHeader
          isStared={!!isStared}
          profileId={profile.id}
          fullName={profile.fullName}
          emailUser={profile.email}
          authId={session?.user.id}
        />
      </Header>
      {user.id === session?.user.id && <EditProfileBtn />}

      <ProfileSummary
        stars={starCount}
        projects={projects.length}
        userId={params.id}
      />
      <Experience experiences={profile.experiences} />
      {profile.skills && <Skills skills={profile.skills} />}
      {projects.length !== 0 && <Projects projects={projects} />}
      <Education educations={profile.educations} />
      <Sections sections={profile.sections} />
    </>
  );
}

export default ViewProfile;
