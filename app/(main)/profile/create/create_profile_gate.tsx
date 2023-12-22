"use client";

import { AppRouter } from "@/utils/router/app_router";
import { useProfileData } from "../_components/profile_context";
import { redirect } from "next/navigation";
export default function CreateProfileGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profileData } = useProfileData();
  profileData.edit && redirect(AppRouter.editProfile);

  return <main>{children}</main>;
}
