import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { databaseDrizzle } from "@/db/database";
import { dev } from "@/db/schemes/projectSchema";
import { and, eq } from "drizzle-orm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { joinProjectSchema } from "@/utils/validations/joinProjectValidation";
import { notification } from "@/db/schemes/notificationSchema";

export async function POST(
  request: NextRequest,
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
    const body = await request.json();
    const validate = joinProjectSchema.safeParse(body);
    if (!validate.success || validate.data.projectAdminId === session.user.id)
      return NextResponse.json(
        { state: false, message: "invalid request" },
        { status: 400 },
      );

    if (validate.data.projectType === "public") {
      await databaseDrizzle.insert(dev).values({
        devId: session.user.id,
        projectId: projectId,
        joinAt: new Date().toISOString(),
      });

      return NextResponse.json(
        {
          state: true,
          message: "dev joined successfully",
          requestStatus: "JOINED",
        },
        { status: 201 },
      );
    }

    await databaseDrizzle.insert(notification).values({
      senderId: session.user.id,
      receiverId: validate.data.projectAdminId,
      projectId: projectId,
      notificationType: "JOIN_REQUEST",
    });
    return NextResponse.json(
      {
        state: true,
        message: "request has been send",
        requestStatus: "WAITING",
      },
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
      { state: true, body: "unjoined successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { state: false, message: error.message },
      { status: 500 },
    );
  }
}
