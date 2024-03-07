import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import {
  deleteTaskSchema,
  editTaskSchema,
  taskSchema,
} from "@/utils/validations/taskValidation";
import { databaseDrizzle } from "@/db/database";
import { TaskInsertion, tasks } from "@/db/schemes/taskSchema";
import { dev, project } from "@/db/schemes/projectSchema";
import { and, eq } from "drizzle-orm";
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.id)
    return NextResponse.json(
      { state: false, message: "Not authorized" },
      { status: 401 },
    );
  const body = await request.json();
  const validation = taskSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { state: false, message: validation.error.format() },
      { status: 400 },
    );
  }
  const { featureId, name, timePeriod, description, assignedTo, order } =
    validation.data;
  const targetProject = await databaseDrizzle
    .select()
    .from(project)
    .where((p) => and(eq(p.owner, session.user.id!)));
  if (!targetProject) {
    const isDev = await databaseDrizzle
      .select()
      .from(dev)
      .where((d) => and(eq(d.devId, session.user.id!)));
    if (!isDev)
      return NextResponse.json(
        {
          state: false,
          message: "Only the members of this project can add new task",
        },
        { status: 401 },
      );
  }

  const newTask: TaskInsertion = {
    assignedTo: assignedTo,
    featureId: featureId,
    creatorId: session.user.id!,
    name: name,
    order: order,
    status: "New",
    description: description,
    startDate: timePeriod?.startDate,
    endDate: timePeriod?.endDate,
  };
  try {
    const taskRes = await databaseDrizzle
      .insert(tasks)
      .values(newTask)
      .returning({ id: tasks.id })
      .then((task) => task[0]);

    return NextResponse.json(
      {
        state: true,
        message: "Task created successfully",
        taskId: taskRes.id,
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
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id)
    return NextResponse.json(
      { state: false, message: "Not authenticated" },
      { status: 401 },
    );
  const body = await request.json();
  const validated = editTaskSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json(
      { state: false, message: validated.error.format() },
      { status: 400 },
    );
  }
  const { id, name, description, timePeriod, assignedTo } = validated.data;
  try {
    const targetProject = await databaseDrizzle
      .select()
      .from(project)
      .where((p) => and(eq(p.owner, session.user.id!)));
    if (!targetProject) {
      const isDev = await databaseDrizzle
        .select()
        .from(dev)
        .where((d) => and(eq(d.devId, session.user.id!)));
      if (!isDev)
        return NextResponse.json(
          {
            state: false,
            message: "Only the members of this project can update this task",
          },
          { status: 401 },
        );
    }
    if (name || description || timePeriod || assignedTo) {
      const newFeature = await databaseDrizzle
        .update(tasks)
        .set({
          name,
          description,
          assignedTo: assignedTo,
          startDate: timePeriod?.startDate,
          endDate: timePeriod?.endDate,
        })
        .where(and(eq(tasks.id, id), eq(tasks.creatorId, session.user.id)))
        .returning()
        .then((fea) => fea[0]);

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

export async function DELETE(request: NextResponse) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id)
    return NextResponse.json(
      { state: false, message: "Not authorized" },
      { status: 401 },
    );
  const body = await request.json();
  const validation = deleteTaskSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { state: false, message: validation.error.format() },
      { status: 400 },
    );
  }
  const { featureId, taskId } = validation.data;
  try {
    const targetProject = await databaseDrizzle
      .select()
      .from(project)
      .where((p) => eq(p.owner, session.user.id!))
      .limit(1);
    if (!targetProject) {
      const isDev = await databaseDrizzle
        .select()
        .from(dev)
        .where((d) => and(eq(d.devId, session.user.id!)));
      if (!isDev)
        return NextResponse.json(
          {
            state: false,
            message: "Only the members of this project can add new task",
          },
          { status: 401 },
        );
    }
    await databaseDrizzle
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.featureId, featureId)));
    return NextResponse.json(
      { state: true, message: "feature deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { state: false, message: error.message },
      { status: 500 },
    );
  }
}
