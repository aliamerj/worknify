import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { reorderFeatureSchema } from "@/utils/validations/featureValidation";
import { databaseDrizzle } from "@/db/database";
import { project } from "@/db/schemes/projectSchema";
import { and, eq } from "drizzle-orm";
import { feature } from "@/db/schemes/featureSchema";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id)
    return NextResponse.json(
      { state: false, message: "Not authenticated" },
      { status: 401 },
    );
  const body = await request.json();
  const validated = reorderFeatureSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json(
      { state: false, message: validated.error.format() },
      { status: 400 },
    );
  }
  const { items, projectId } = validated.data;
  try {
    const targetProject = await databaseDrizzle
      .select()
      .from(project)
      .where((p) => and(eq(p.owner, session.user.id!), eq(p.id, projectId)));
    if (!targetProject) {
      return NextResponse.json(
        {
          state: false,
          message: "Only the owner of this project can reorder the feature",
        },
        { status: 401 },
      );
    }
    items.map(async (fea) => {
      await databaseDrizzle
        .update(feature)
        .set({
          order: fea.order,
        })
        .where(
          and(eq(feature.projectId, projectId), eq(feature.id, fea.featureId)),
        );
    });

    return NextResponse.json(
      {
        state: true,
        message: "Feature Updated successfully",
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
