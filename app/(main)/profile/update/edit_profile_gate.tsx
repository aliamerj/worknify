"use client";

import { AppRouter } from "@/utils/router/app_router";

import { redirect } from "next/navigation";
import { useProfileData } from "../_components/context/profile_context";
export default function EditProfileGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profileData } = useProfileData();
  !profileData.edit && redirect(AppRouter.createProfile);
  return <main>{children}</main>;
}
