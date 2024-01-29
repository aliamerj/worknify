import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { databaseDrizzle } from "@/db/database";
import { dev } from "@/db/schemes/projectSchema";
import { and, eq } from "drizzle-orm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  _: NextRequest,
  { params }: { params: { projectId: string } },
) {
  const session = await getServerSession(authOptions);
  const projectId = parseInt(params.projectId);
  if (!session || !session.user.id || !projectId)
    return NextResponse.json(
      { state: false, message: "Not authenticated" },
      { status: 401 },
    );

  try {
    await databaseDrizzle.insert(dev).values({
      devId: session.user.id,
      projectId: projectId,
      joinAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { state: true, body: "dev joined successfully" },
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
    return NextResponse.json(
      { state: false, message: "Not authenticated" },
      { status: 401 },
    );

  try {
    await databaseDrizzle
      .delete(dev)
      .where(and(eq(dev.projectId, projectId), eq(dev.devId, session.user.id)));

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
