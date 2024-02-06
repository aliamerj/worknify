import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { featureSchema } from "@/utils/validations/featureValidation";
import { databaseDrizzle } from "@/db/database";
import { FeatureInsertion, feature } from "@/db/schemes/featureSchema";

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
  const newFeature: FeatureInsertion = {
    projectId: projectId,
    featureName: featureName,
    order: order,
    description: description,
    tags: tag.join(";"),
    startDate: timePeriod.startDate,
    endDate: timePeriod.endDate,
  };
  try {
    await databaseDrizzle.insert(feature).values(newFeature);

    return NextResponse.json(
      { state: true, message: "Feature created successfully" },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { state: false, message: error.message },
      { status: 500 },
    );
  }
}
