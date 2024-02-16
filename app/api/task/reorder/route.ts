import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { databaseDrizzle } from "@/db/database";
import { dev, project } from "@/db/schemes/projectSchema";
import { and, eq } from "drizzle-orm";
import { reorderTaskSchema } from "@/utils/validations/taskValidation";
import { tasks } from "@/db/schemes/taskSchema";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id)
    return NextResponse.json(
      { state: false, message: "Not authenticated" },
      { status: 401 },
    );
  const body = await request.json();
  const validated = reorderTaskSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json(
      { state: false, message: validated.error.format() },
      { status: 400 },
    );
  }
  const { featureId, projectId, taskId, newOrder, newStatus } = validated.data;
  try {
    const targetProject = await databaseDrizzle
      .select()
      .from(project)
      .where((p) => and(eq(p.owner, session.user.id!), eq(p.id, projectId)));
    if (!targetProject) {
      const isDev = await databaseDrizzle
        .select()
        .from(dev)
        .where((d) =>
          and(eq(d.projectId, projectId), eq(d.devId, session.user.id!)),
        );
      if (!isDev)
        return NextResponse.json(
          {
            state: false,
            message: "Only the members of this project can change the order",
          },
          { status: 401 },
        );
    }

    if (newOrder || newStatus) {
      const newFeature = await databaseDrizzle
        .update(tasks)
        .set({
          order: newOrder,
          status: newStatus ?? undefined,
        })
        .where(and(eq(tasks.id, taskId), eq(tasks.featureId, featureId)));

      return NextResponse.json(
        {
          state: true,
          message: "Task Updated successfully",
          data: newFeature,
        },
        { status: 200 },
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { state: false, message: error.message },
      { status: 500 },
    );
  }
}
