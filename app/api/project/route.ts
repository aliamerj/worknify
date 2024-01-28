import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import {
  projectSchema,
  updateProjectSchema,
} from "@/utils/validations/projectValidation";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, uploadProjectLogo } from "@/utils/aws/s3_bucket";
import { databaseDrizzle } from "@/db/database";
import { ProjectInsertion, project } from "@/db/schemes/projectSchema";
import { and, eq } from "drizzle-orm";

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
  const { logo, name, type, timePeriod, description, projectGoal, link } =
    validation.data;

  if (logo && logo instanceof File) {
    try {
      const imageUrl = await setImageInBucket(
        session.user.id!,
        `${session.user.id!}-${name}`,
        logo,
      );

      const newProject: ProjectInsertion = {
        owner: session.user.id!,
        name: name,
        logo: imageUrl.split("?")[0],
        type: type,
        link: link,
        projectGoal: projectGoal,
        description: description,
        startDate: timePeriod.startDate,
        endDate: timePeriod.endDate,
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
  const { id, name, description, link, timePeriod, type, projectGoal } =
    validated.data;
  try {
    if (body.logoKey && body.logo instanceof File) {
      await setImageInBucket(session.user.id!, body.logoKey, body.logo);
    }
    if (name || type || projectGoal || link || description || timePeriod)
      await databaseDrizzle
        .update(project)
        .set({
          name,
          type,
          projectGoal,
          link,
          description,
          startDate: timePeriod?.startDate,
          endDate: timePeriod?.endDate,
        })
        .where(and(eq(project.owner, session.user.id!), eq(project.id, id!)));
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

function serializeProjectData(project: FormData) {
  const body: any = {};
  for (const [key, value] of project.entries()) {
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
