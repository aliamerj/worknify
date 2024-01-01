"use client";

import { AppRouter } from "@/utils/router/app_router";
import { redirect } from "next/navigation";
import { useProfileData } from "../_components/context/profile_context";
export default function CreateProfileGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profileData } = useProfileData();
  profileData.edit && redirect(AppRouter.editProfile);

  return <main>{children}</main>;
}
