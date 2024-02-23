"use client";

import { AppRouter } from "@/utils/router/app_router";
import { redirect } from "next/navigation";
import { useProfileData } from "../_components/context/profile_context";
import { useEffect } from "react";
/**
 * This component acts as a gatekeeper for rendering its child components.
 * It checks if the `profileData` has an `edit` property and if it does,
 * it redirects the user to the edit profile page.
 *
 * param children - The child components to be rendered within the `CreateProfileGate` component.
 * returns The child components wrapped within a `<main>` element.
 */
export default function CreateProfileGate({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { profileData } = useProfileData();

  useEffect(() => {
    if (profileData.edit) {
      redirect(AppRouter.editProfile);
    }
  }, [profileData.edit]);

  return <main>{children}</main>;
}
