import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { databaseDrizzle } from "@/db/database";
import { starProject } from "@/db/schemes/projectSchema";
import { and, eq } from "drizzle-orm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  _: NextRequest,
  { params }: { params: { projectId: string } },
) {
  const session = await getServerSession(authOptions);
  const projectId = parseInt(params.projectId);
  if (!session || !session.user.id || !projectId)
    return NextResponse.json({}, { status: 401 });

  try {
    await databaseDrizzle.insert(starProject).values({
      userId: session.user.id,
      projectId: projectId,
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
  { params }: { params: { projectId: string } },
) {
  const session = await getServerSession(authOptions);
  const projectId = parseInt(params.projectId);
  if (!session || !session.user.id || !projectId)
    return NextResponse.json({}, { status: 401 });

  try {
    await databaseDrizzle
      .delete(starProject)
      .where(
        and(
          eq(starProject.projectId, projectId),
          eq(starProject.userId, session.user.id),
        ),
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
