import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { projectSchema } from "@/utils/validations/projectValidation";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, uploadProjectLogo } from "@/utils/aws/s3_bucket";
import { databaseDrizzle } from "@/db/database";
import { ProjectInsertion, project } from "@/db/schemes/projectSchema";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id)
    return NextResponse.json(
      { state: false, message: "Not authenticated" },
      { status: 401 },
    );
  const body: any = {};
  const formData = await request.formData();

  for (const [key, value] of formData.entries()) {
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
  console.log(body);

  const validation = projectSchema.safeParse(body);
  if (!validation.success) {
    console.log(validation.error);
    return NextResponse.json(
      { state: false, message: validation.error.format() },
      { status: 400 },
    );
  }
  const { logo, name, type, timePeriod, description, projectGoal, link } =
    validation.data;

  if (logo && logo instanceof File) {
    try {
      const signedUrl = await getSignedUrl(
        s3,
        uploadProjectLogo(
          `${session.user.id!}-${name}`,
          logo.type,
          logo.size,
          session.user.id!,
        ),
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
      const newProject: ProjectInsertion = {
        owner: session.user.id!,
        name: name,
        logo: signedUrl.split("?")[0],
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
      console.log(err);
      return NextResponse.json(
        { state: false, message: "Failed to Upload Image" },
        { status: 500 },
      );
    }
  }
}