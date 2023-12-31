import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { databaseDrizzle } from "@/db/database";
import { star } from "@/db/schemes/profileSchema";
import { authOptions } from "../../auth/[...nextauth]/route";
import { and, eq } from "drizzle-orm";

export async function POST(
  _: NextRequest,
  { params }: { params: { profileId: string } },
) {
  const session = await getServerSession(authOptions);
  const profileId = parseInt(params.profileId);
  if (!session || !session.user.id || !profileId)
    return NextResponse.json({}, { status: 401 });

  try {
    await databaseDrizzle.insert(star).values({
      userId: session.user.id,
      profileId: profileId,
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

export async function DELETE(
  _: NextRequest,
  { params }: { params: { profileId: string } },
) {
  const session = await getServerSession(authOptions);
  const profileId = parseInt(params.profileId);
  if (!session || !session.user.id || !profileId)
    return NextResponse.json({}, { status: 401 });

  try {
    await databaseDrizzle
      .delete(star)
      .where(
        and(eq(star.profileId, profileId), eq(star.userId, session.user.id)),
      );

    return NextResponse.json(
      { state: true, body: "Star deleted successfully" },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { state: false, message: error.message },
      { status: 500 },
    );
  }
}
