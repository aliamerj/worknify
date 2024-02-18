import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { databaseDrizzle } from "@/db/database";
import { dev, project } from "@/db/schemes/projectSchema";
import { and, eq } from "drizzle-orm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notificationSchema } from "@/utils/validations/notificationsValidation";
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
    const validate = notificationSchema.safeParse(body);
    if (!validate.success || validate.data.senderId === session.user.id)
      return NextResponse.json(
        { state: false, message: "invalid request" },
        { status: 400 },
      );
    if (validate.data.notificationType === "JOIN_REQUEST") {
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
        receiverId: validate.data.senderId,
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
    }
    if (validate.data.notificationType === "ACCEPT_REQUEST") {
      await databaseDrizzle.transaction(async (trx) => {
        await trx.insert(dev).values({
          devId: validate.data.senderId,
          projectId: projectId,
          joinAt: new Date().toISOString(),
        });
        await trx.insert(notification).values({
          senderId: session.user.id!,
          receiverId: validate.data.senderId,
          projectId: projectId,
          notificationType: "ACCEPT_REQUEST",
        });
        await trx
          .delete(notification)
          .where(
            and(
              eq(notification.projectId, projectId),
              eq(notification.senderId, validate.data.senderId),
              eq(notification.receiverId, session.user.id!),
              eq(notification.notificationType, "JOIN_REQUEST"),
            ),
          );
      });
      return NextResponse.json(
        {
          state: true,
          message: "New user has Joined the project",
          requestStatus: "JOINED",
        },
        { status: 200 },
      );
    }
    if (validate.data.notificationType === "REJECT_REQUEST") {
      await databaseDrizzle.transaction(async (trx) => {
        await trx.insert(notification).values({
          senderId: session.user.id!,
          receiverId: validate.data.senderId,
          projectId: projectId,
          notificationType: "REJECT_REQUEST",
        });
        await trx
          .delete(notification)
          .where(
            and(
              eq(notification.projectId, projectId),
              eq(notification.senderId, validate.data.senderId),
              eq(notification.receiverId, session.user.id!),
              eq(notification.notificationType, "JOIN_REQUEST"),
            ),
          );
      });
    }
    return NextResponse.json(
      {
        state: true,
        message: "User has Rejected to join the project",
        requestStatus: "UNJOINED",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { state: false, message: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { projectId: string } },
) {
  const session = await getServerSession(authOptions);
  const projectId = parseInt(params.projectId);
  if (!session || !session.user.id || !projectId)
    return NextResponse.json(
      { state: false, message: "Not authenticated" },
      { status: 401 },
    );
  const body = await req.json();

  try {
    if (!body.devId) {
      await databaseDrizzle
        .delete(dev)
        .where(
          and(eq(dev.projectId, projectId), eq(dev.devId, session.user.id)),
        );

      return NextResponse.json(
        { state: true, body: "unjoined successfully" },
        { status: 200 },
      );
    }
    const sqlRes = await databaseDrizzle
      .select({ owner: project.owner })
      .from(project)
      .where(
        and(eq(project.id, projectId), eq(project.owner, session.user.id)),
      );
    if (sqlRes[0].owner) {
      await databaseDrizzle
        .delete(dev)
        .where(and(eq(dev.projectId, projectId), eq(dev.devId, body.devId)));
    }

    return NextResponse.json(
      { state: true, body: "user removed successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { state: false, message: error.message },
      { status: 500 },
    );
  }
}
