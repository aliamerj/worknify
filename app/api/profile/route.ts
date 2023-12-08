import { databaseDrizzle } from "@/db/database";
import { profile } from "@/db/schemes/profileSchema";
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
  try {
    await databaseDrizzle.transaction(async (trx) => {
      const newProfile = await trx
        .insert(profile)
        .values({ ...validation.data })
        .returning({ id: profile.id });
      const profileId = newProfile[0].id;
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
