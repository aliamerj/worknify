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
import { and, eq } from "drizzle-orm";


export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get the session using getServerSession and authOptions
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json(
        { state: false, message: "Not authorized" },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();

    // Validate the parsed body against the profile schema
    const validation = profileSchemaValidation.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { state: false, message: validation.error.format() },
        { status: 400 }
      );
    }

    // Extract the necessary data from the validated body
    const {
      sections = [],
      educations = [],
      experiences = [],
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

    // Create a new profile data object with the extracted data and the session user ID
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

    // Start a database transaction
    await databaseDrizzle.transaction(async (trx) => {
      // Insert the new profile data into the profile table and retrieve the inserted profile ID
      const [newProfile] = await trx
        .insert(profile)
        .values(newProfileData)
        .returning({ id: profile.id });

      const profileId = newProfile.id;

      // Insert sections into the section table with the retrieved profile ID
      const newSections: SectionInsertion[] = sections.map((section) => ({
        ...section,
        profileId,
      }));
      if (newSections.length > 0) {
        await trx.insert(section).values(newSections);
      }

      // Insert educations into the education table with the retrieved profile ID
      const newEducations: EducationInsertion[] = educations.map((ed) => ({
        ...ed,
        startDate: ed.timePeriod.startDate,
        endDate: ed.timePeriod.endDate,
        profileId,
      }));
      if (newEducations.length > 0) {
        await trx.insert(education).values(newEducations);
      }

      // Insert experiences into the experience table with the retrieved profile ID
      const newExperiences: ExperienceInsertion[] = experiences.map(
        (experience) => ({
          ...experience,
          startDate: experience.timePeriod.startDate,
          endDate: experience.timePeriod.endDate,
          profileId,
          company: experience.company,
        })
      );
      if (newExperiences.length > 0) {
        await trx.insert(experience).values(newExperiences);
      }
    });

    // Return a success response
    return NextResponse.json(
      { state: true, message: "Profile created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    // Return an error response
    return NextResponse.json(
      { state: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * Handles a PATCH request to update the user's profile information.
 * param req - The request object representing the PATCH request.
 * returns A JSON response indicating the success or failure of the update operation.
 */
export async function PATCH(req: NextRequest) {
  try {
    // Check if the user is authorized
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { state: false, message: "Not authorized" },
        { status: 401 }
      );
    }

    // Parse the request body as JSON
    const body = await req.json();

    // Validate the input data
    const validation = editProfileSchemaValidation.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { state: false, message: validation.error.format() },
        { status: 400 }
      );
    }

    // Extract the relevant data fields from the validated data
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

    // Update the profile table if any profile fields are present
    const profileFields = {
      fullName,
      jobTitle,
      background,
      address,
      email,
      github,
      linkedin,
      skills,
      phoneNumber,
    };
    const hasProfileFields = Object.values(profileFields).some(
      (value) => value !== undefined
    );
    if (hasProfileFields) {
      await databaseDrizzle
        .update(profile)
        .set(profileFields)
        .where(eq(profile.userId, session.user.id!));
    }

    // Update the sections table
    if (sections) {
      for (const { title, description, id } of sections) {
        await databaseDrizzle
          .update(section)
          .set({ title, description })
          .where(and(eq(section.profileId, profileId), eq(section.id, id!)));
      }
    }

    // Update the educations table
    if (educations) {
      for (const { school, degree, timePeriod, id } of educations) {
        await databaseDrizzle
          .update(education)
          .set({
            school,
            degree,
            startDate: timePeriod.startDate,
            endDate: timePeriod.endDate,
          })
          .where(
            and(eq(education.profileId, profileId), eq(education.id, id!))
          );
      }
    }

    // Update the experiences table
    if (experiences) {
      for (const {
        company,
        role,
        timePeriod,
        description,
        id,
      } of experiences) {
        await databaseDrizzle
          .update(experience)
          .set({
            company,
            role,
            description,
            startDate: timePeriod.startDate,
            endDate: timePeriod.endDate,
          })
          .where(
            and(eq(experience.profileId, profileId), eq(experience.id, id!))
          );
      }
    }

    return NextResponse.json(
      { state: true, message: "Profile Updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { state: false, message: error.message },
      { status: 500 }
    );
  }
}
