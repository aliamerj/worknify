import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import {
  editFeatureSchema,
  deleteFeatureSchema,
  featureSchema,
} from "@/utils/validations/featureValidation";
import { databaseDrizzle } from "@/db/database";
import { FeatureInsertion, feature } from "@/db/schemes/featureSchema";
import { project } from "@/db/schemes/projectSchema";
import { and, eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id)
    return NextResponse.json(
      { state: false, message: "Not authorized" },
      { status: 401 },
    );
  const body = await request.json();
  const validation = featureSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { state: false, message: validation.error.format() },
      { status: 400 },
    );
  }
  const { featureName, order, description, tag, timePeriod, projectId } =
    validation.data;
  const targetProject = await databaseDrizzle
    .select()
    .from(project)
    .where((p) => and(eq(p.owner, session.user.id!), eq(p.id, projectId)));
  if (!targetProject) {
    return NextResponse.json(
      {
        state: false,
        message: "Only the owner of this project can add new feature",
      },
      { status: 401 },
    );
  }

  const newFeature: FeatureInsertion = {
    projectId: projectId,
    featureName: featureName,
    order: order,
    description: description,
    tags: tag?.join(";"),
    startDate: timePeriod?.startDate,
    endDate: timePeriod?.endDate,
  };
  try {
    const featureRes = await databaseDrizzle
      .insert(feature)
      .values(newFeature)
      .returning({ id: feature.id })
      .then((fea) => fea[0]);

    return NextResponse.json(
      {
        state: true,
        message: "Feature created successfully",
        featureId: featureRes.id,
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
  const validated = editFeatureSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json(
      { state: false, message: validated.error.format() },
      { status: 400 },
    );
  }
  const { id, projectId, featureName, description, timePeriod, tag } =
    validated.data;
  try {
    const targetProject = await databaseDrizzle
      .select()
      .from(project)
      .where((p) => and(eq(p.owner, session.user.id!), eq(p.id, projectId)));
    if (!targetProject) {
      return NextResponse.json(
        {
          state: false,
          message: "Only the owner of this project can update new feature",
        },
        { status: 401 },
      );
    }

    if (featureName || description || timePeriod || tag) {
      const newFeature = await databaseDrizzle
        .update(feature)
        .set({
          featureName,
          description,
          tags: tag?.join(";"),
          startDate: timePeriod?.startDate,
          endDate: timePeriod?.endDate,
        })
        .where(and(eq(feature.projectId, projectId), eq(feature.id, id)))
        .returning()
        .then((fea) => fea[0]);

      return NextResponse.json(
        {
          state: true,
          message: "Feature Updated successfully",
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
  const validation = deleteFeatureSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { state: false, message: validation.error.format() },
      { status: 400 },
    );
  }
  const { featureId, projectId } = validation.data;
  try {
    const targetProject = await databaseDrizzle
      .select()
      .from(project)
      .where((p) => and(eq(p.id, projectId), eq(p.owner, session.user.id!)))
      .limit(1);
    if (!targetProject)
      return NextResponse.json(
        { state: false, message: "Not authorized" },
        { status: 401 },
      );
    await databaseDrizzle
      .delete(feature)
      .where(and(eq(feature.projectId, projectId), eq(feature.id, featureId)));
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
