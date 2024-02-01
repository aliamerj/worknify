import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { databaseDrizzle } from "@/db/database";
import { notification } from "@/db/schemes/notificationSchema";
import { and, eq } from "drizzle-orm";

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  const notificId = parseInt(params.id);
  if (!session || !session.user.id || !notificId)
    return NextResponse.json(
      { state: false, message: "Not authenticated" },
      { status: 401 },
    );

  try {
    await databaseDrizzle
      .delete(notification)
      .where(
        and(
          eq(notification.id, notificId),
          eq(notification.receiverId, session.user.id!),
        ),
      );

    return NextResponse.json(
      {
        state: true,
        body: `notification delete successfully with ${notificId}`,
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
