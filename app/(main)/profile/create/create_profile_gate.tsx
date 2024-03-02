"use client";

import { AppRouter } from "@/utils/router/app_router";
import { redirect } from "next/navigation";
import { useProfileData } from "../_components/context/hooks";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  ProfileSchema,
  profileSchemaValidation,
} from "@/utils/validations/profileValidation";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const profileData = useProfileData();

  useEffect(() => {
    if (profileData.edit) {
      redirect(AppRouter.editProfile);
    }
  }, [profileData.edit]);

  const methods = useForm<ProfileSchema>({
    defaultValues: profileData,
    resolver: zodResolver(profileSchemaValidation),
  });

  return (
    <FormProvider {...methods}>
      {" "}
      <main>{children}</main>
    </FormProvider>
  );
}
