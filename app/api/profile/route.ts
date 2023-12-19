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
import { profileSchemaValidation } from "@/utils/validations/profileValidation";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { users } from "@/db/schemes/userSchema";
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
      const newExPeriences: ExperienceInsertion[] = experiences.map((ed) => ({
        ...ed,
        startDate: ed.timePeriod.startDate,
        endData: ed.timePeriod.endDate,
        profileId,
      }));
      experiences.length != 0 &&
        (await trx.insert(experience).values(newExPeriences));

      await trx
        .update(users)
        .set({ profileId })
        .where(eq(users.id, session.user.id!));
      return newProfile;
    });
    return NextResponse.json(
      { state: true, body: "profile created successfully" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ state: false, body: error }, { status: 500 });
  }
}