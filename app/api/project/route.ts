import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import {
  projectSchema,
  updateProjectSchema,
} from "@/utils/validations/projectValidation";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  deleteProjectLogo,
  s3,
  uploadProjectLogo,
} from "@/utils/aws/s3_bucket";
import { databaseDrizzle } from "@/db/database";
import {
  ProjectInsertion,
  ProjectSelection,
  project,
} from "@/db/schemes/projectSchema";
import { and, eq } from "drizzle-orm";
import { users } from "@/db/schemes/userSchema";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id)
    return NextResponse.json(
      { state: false, message: "Not authenticated" },
      { status: 401 },
    );

  const formData = await request.formData();
  const body = serializeProjectData(formData);
  const validation = projectSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { state: false, message: validation.error.format() },
      { status: 400 },
    );
  }
  const profileId = await databaseDrizzle
    .select({ profileId: users.profileId, id: users.id })
    .from(users)
    .where((u) => eq(u.id, session.user.id!))
    .then((res) => res[0].profileId);
  if (!profileId)
    return NextResponse.json(
      {
        state: false,
        message: "Please,Create profile first",
      },
      { status: 401 },
    );
  const {
    logo,
    name,
    type,
    timePeriod,
    description,
    projectGoal,
    link,
    techUsed,
  } = validation.data;

  try {
    var imageUrl;
    if (logo && logo instanceof File) {
      imageUrl = await setImageInBucket(
        session.user.id!,
        `${session.user.id!}-${name}`,
        logo,
      );
    }

    const newProject: ProjectInsertion = {
      owner: session.user.id!,
      name: name,
      logo: imageUrl && imageUrl.split("?")[0],
      type: type as ProjectSelection["type"],
      link: link,
      projectGoal: projectGoal,
      description: description,
      startDate: timePeriod.startDate,
      endDate: timePeriod.endDate,
      techUsed: techUsed,
    };

    const res = await databaseDrizzle
      .insert(project)
      .values(newProject)
      .returning({ id: project.id })
      .then((pro) => pro[0]);

    return NextResponse.json(
      { state: true, projectId: res.id },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      { state: false, message: "Failed to Upload Image" },
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
  const formatData = await request.formData();
  const body = serializeProjectData(formatData);
  const validated = updateProjectSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json(
      { state: false, message: validated.error.format() },
      { status: 400 },
    );
  }
  const {
    id,
    name,
    description,
    link,
    timePeriod,
    type,
    projectGoal,
    techUsed,
  } = validated.data;

  try {
    const targetProject = await databaseDrizzle
      .select({ owner: project.owner, id: project.id })
      .from(project)
      .where((p) => and(eq(p.owner, session.user.id!), eq(p.id, id)))
      .then((res) => res[0].owner);
    if (!targetProject)
      return NextResponse.json(
        { state: false, message: "Not authorized" },
        { status: 401 },
      );

    if (body.logoKey && body.logo instanceof File) {
      await setImageInBucket(session.user.id!, body.logoKey, body.logo);
    }

    if (
      techUsed ||
      name ||
      type ||
      projectGoal ||
      link ||
      description ||
      timePeriod
    )
      await databaseDrizzle
        .update(project)
        .set({
          techUsed,
          name,
          type,
          projectGoal,
          link,
          description,
          startDate: timePeriod?.startDate,
          endDate: timePeriod?.endDate,
        })
        .where(and(eq(project.owner, session.user.id!), eq(project.id, id)));

    return NextResponse.json(
      { state: true, message: "Project Updated successfully" },
      { status: 200 },
    );
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
      { state: false, message: "Not authenticated" },
      { status: 401 },
    );
  const body = await request.json();
  const projectId = parseInt(body.projectId);

  if (!projectId)
    return NextResponse.json(
      { state: false, message: "Invalid Project,Please try again" },
      { status: 400 },
    );
  try {
    const myProject = await databaseDrizzle
      .select({ owner: project.owner, id: project.id })
      .from(project)
      .where((p) => and(eq(p.owner, session.user.id!), eq(p.id, projectId)))
      .then((res) => res[0].owner);
    if (!myProject)
      return NextResponse.json(
        { state: false, message: "Not authorized" },
        { status: 401 },
      );
    const targetProject = await databaseDrizzle
      .delete(project)
      .where(and(eq(project.id, projectId), eq(project.owner, session.user.id)))
      .returning()
      .then((res) => res[0]);

    if (!targetProject)
      return NextResponse.json(
        {
          status: false,
          message: "Project Not Found",
        },
        { status: 404 },
      );
    if (targetProject.logo) {
      const deleteRequest = deleteProjectLogo(targetProject.logo);
      s3.send(deleteRequest);
    }
    return NextResponse.json(
      { state: true, message: "Project Deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { state: false, message: error.message },
      { status: 500 },
    );
  }
}

function serializeProjectData(project: FormData) {
  const body: any = {};
  for (const [key, value] of project.entries()) {
    if (key == "id") body["id"] = value;
    if (key === "logo") {
      body[key] = value;
    } else {
      try {
        body[key] = JSON.parse(value as string);
      } catch (error) {
        body[key] = value;
      }
    }
  }
  return body;
}

async function setImageInBucket(userId: string, logoKey: string, logo: File) {
  const signedUrl = await getSignedUrl(
    s3,
    uploadProjectLogo(logoKey, logo.type, logo.size, userId),
    {
      expiresIn: 60,
    },
  );
  fetch(signedUrl, {
    method: "PUT",
    body: logo,
    headers: {
      "content-type": logo.type,
    },
  });
  return signedUrl;
}
