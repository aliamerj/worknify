import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { taskSchema } from "@/utils/validations/taskValidation";
import { databaseDrizzle } from "@/db/database";
import { TaskInsertion, tasks } from "@/db/schemes/taskSchema";
import { dev, project } from "@/db/schemes/projectSchema";
import { and,eq } from "drizzle-orm";
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
  const { featureId,name,timePeriod,description,AssignedTo,projectId,order } =
    validation.data;
  const targetProject = await databaseDrizzle
    .select()
    .from(project)
    .where((p) => and(eq(p.owner, session.user.id!), eq(p.id, projectId)));
  if (!targetProject) {
    const isDev = await databaseDrizzle.select().from(dev).where((d)=>and(eq(d.projectId,projectId),eq(d.devId,session.user.id!)))
    if(!isDev) return NextResponse.json(
      {
        state: false,
        message: "Only the members of this project can add new task",
      },
      { status: 401 },
    );
  }

  const newTask: TaskInsertion = {
    assignedTo:AssignedTo,
    projectId:projectId,
    featureId:featureId,
    name: name,
    order: order,
    status: 'New',
    description: description,
    startDate: timePeriod.startDate,
    endDate: timePeriod.endDate,
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
