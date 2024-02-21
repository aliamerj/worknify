import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { databaseDrizzle } from "@/db/database";
import { star } from "@/db/schemes/profileSchema";
import { and, eq } from "drizzle-orm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Handles a POST request to create a star for a profile.
 * @param _: The NextRequest object representing the incoming request.
 * @param params.profileId The ID of the profile for which the star is being created.
 * @returns A JSON response indicating the success or failure of the operation.
 */
export async function POST(
  _: NextRequest,
  { params }: { params: { profileId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    const profileId = parseInt(params.profileId);

    if (!session?.user?.id || isNaN(profileId)) {
      return NextResponse.json({}, { status: 401 });
    }

    await databaseDrizzle.insert(star).values({
      userId: session.user.id,
      profileId,
    });

    return NextResponse.json(
      { state: true, body: "Star created successfully" },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { state: false, message: error.message },
      { status: 500 },
    );
  }
}

/**
 * Deletes a star from a profile.
 * @param _: The NextRequest object.
 * @param params.profileId The ID of the profile from which the star should be deleted.
 * @returns A NextResponse object with the result of the deletion.
 */
export async function DELETE(
  _: NextRequest,
  { params }: { params: { profileId: string } },
): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  const profileId = parseInt(params.profileId);

  if (!session?.user?.id || !profileId) {
    return NextResponse.json({}, { status: 401 });
  }

  try {
    await databaseDrizzle
      .delete(star)
      .where(
        and(eq(star.profileId, profileId), eq(star.userId, session.user.id)),
      );

    return  NextResponse.json(
      { state: true, body: "Star deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { state: false, message: error.message },
      { status: 500 },
    );
  }
}
