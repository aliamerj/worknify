"use client";

import { AppRouter } from "@/utils/router/app_router";

import { redirect } from "next/navigation";
import { useProfileData } from "../_components/context/profile_context";
/**
 * This component acts as a gatekeeper for accessing the edit profile functionality.
 * It checks if the user has the necessary profile data and redirects them to the create profile page if not.
 *
 * @param children - The child components to be rendered within the EditProfileGate component.
 * @returns The child components wrapped within a <main> element.
 */
export default function EditProfileGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profileData } = useProfileData();

  // Redirect the user to the create profile page if they don't have the necessary profile data
  if (!profileData.edit) {
    redirect(AppRouter.createProfile);
  }

  return <main>{children}</main>;
}
