import { databaseDrizzle } from "@/db/database";
import {
  EducationInsertion,
  ExperienceInsertion,
  ProfileInsertion,
  SectionInsertion,
  education,
  experience,
  profile,
  section,
} from "@/db/schemes/profileSchema";
import {
  editProfileSchemaValidation,
  profileSchemaValidation,
} from "@/utils/validations/profileValidation";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id)
    return NextResponse.json({}, { status: 401 });

  const body = await request.json();
  const validation = profileSchemaValidation.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { state: true, body: validation.error.format() },
      { status: 400 },
    );
  }

  const {
    sections,
    educations,
    experiences,
    jobTitle,
    fullName,
    background,
    phoneNumber,
    address,
    email,
    github,
    linkedin,
    skills,
  } = validation.data;
  const newProfileData: ProfileInsertion = {
    fullName,
    jobTitle,
    background,
    phoneNumber,
    address,
    email,
    github,
    linkedin,
    skills,
    userId: session.user.id,
  };

  try {
    await databaseDrizzle.transaction(async (trx) => {
      const newProfile = await trx
        .insert(profile)
        .values(newProfileData)
        .returning({ id: profile.id });
      const profileId = newProfile[0].id;
      // insert sections
      const newSections: SectionInsertion[] = sections.map((section) => ({
        ...section,
        profileId,
      }));
      newSections.length != 0 &&
        (await trx.insert(section).values(newSections));
      // insert educations
      const newEducations: EducationInsertion[] = educations.map((ed) => ({
        ...ed,
        startDate: ed.timePeriod.startDate,
        endData: ed.timePeriod.endDate,
        profileId,
      }));
      educations.length != 0 &&
        (await trx.insert(education).values(newEducations));
      // insert experiences
      const newExPeriences: ExperienceInsertion[] = experiences.map(
        (experience) => ({
          ...experience,
          startDate: experience.timePeriod.startDate,
          endData: experience.timePeriod.endDate,
          profileId,
          company: experience.company,
        }),
      );
      experiences.length != 0 &&
        (await trx.insert(experience).values(newExPeriences));
      return newProfile;
    });
    return NextResponse.json(
      { state: true, body: "profile created successfully" },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { state: false, message: error.message },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });
  const body = await req.json();
  const validation = editProfileSchemaValidation.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.format(), {
      status: 400,
    });
  const {
    sections,
    educations,
    experiences,
    jobTitle,
    fullName,
    background,
    phoneNumber,
    address,
    email,
    github,
    linkedin,
    skills,
    profileId,
  } = validation.data;

  try {
    await databaseDrizzle
      .update(profile)
      .set({
        fullName,
        jobTitle,
        background,
        address,
        email,
        github,
        linkedin,
        skills,
        phoneNumber,
      })
      .where(eq(profile.userId, session.user.id!));
    if (sections) {
      for (const { title, description } of sections) {
        await databaseDrizzle
          .update(section)
          .set({
            title,
            description,
          })
          .where(eq(section.profileId, profileId));
      }
    }

    if (educations) {
      for (const { school, degree, timePeriod } of educations) {
        await databaseDrizzle
          .update(education)
          .set({
            school,
            degree,
            startDate: timePeriod.startDate,
            endData: timePeriod.endDate,
          })
          .where(eq(education.profileId, profileId));
      }
    }
    if (experiences) {
      for (const { company, role, timePeriod, description } of experiences) {
        await databaseDrizzle
          .update(experience)
          .set({
            company,
            role,
            description,
            startDate: timePeriod.startDate,
            endData: timePeriod.endDate,
          })
          .where(eq(experience.profileId, profileId));
      }
    }

    return NextResponse.json(
      { state: true, message: "Profile Updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { state: false, message: error.message },
      { status: 500 },
    );
  }
}
