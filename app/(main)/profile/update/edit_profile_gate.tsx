"use client";

import { AppRouter } from "@/utils/router/app_router";
import { useProfileData } from "../_components/profile_context";
import { redirect } from "next/navigation";
export default function EditProfileGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profileData } = useProfileData();
  !profileData.edit && redirect(AppRouter.createProfile);
  return <main>{children}</main>;
}
