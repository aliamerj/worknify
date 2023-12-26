import { databaseDrizzle } from "@/db/database";
import { notFound } from "next/navigation";
import React from "react";
import { Header } from "../_components/header/header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface Props {
  params: { id: string };
}
async function ViewProfile({ params }: Props) {
  const sesstion = await getServerSession(authOptions);
  var id = sesstion?.user.id;
  var image = sesstion?.user.image;
  if (!sesstion || id !== params.id) {
    const user = await databaseDrizzle.query.users.findFirst({
      where: (u, o) => o.or(o.eq(u.id, params.id), o.eq(u.username, params.id)),
    });
    if (!user) return notFound();
    id = user.id;
    image = user.image;
  }

  const profile = await databaseDrizzle.query.profile.findFirst({
    where: (p, o) => o.eq(p.userId, id!),
  });

  if (!profile) notFound();
  return (
    <>
      <Header
        fullName={profile.fullName}
        username={params.id}
        background={profile.background}
        image={image ?? undefined}
      />
    </>
  );
}

export default ViewProfile;
