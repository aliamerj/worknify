"use client";

import { AppRouter } from "@/utils/router/app_router";

import { redirect } from "next/navigation";
import { useProfileData } from "../_components/context/hooks";
import { FormProvider, useForm } from "react-hook-form";
import {
  ProfileSchema,
  profileSchemaValidation,
} from "@/utils/validations/profileValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
/**
 * This component acts as a gatekeeper for accessing the edit profile functionality.
 * It checks if the user has the necessary profile data and redirects them to the create profile page if not.
 *
 * param children - The child components to be rendered within the EditProfileGate component.
 * returns The child components wrapped within a <main> element.
 */
export default function EditProfileGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const profileData = useProfileData();
  useEffect(() => {
    if (!profileData.edit) {
      redirect(AppRouter.createProfile);
    }
  }, [profileData.edit]);
  const methods = useForm<ProfileSchema>({
    defaultValues: profileData,
    resolver: zodResolver(profileSchemaValidation),
  });

  return (
    <FormProvider {...methods}>
      <main>{children}</main>
    </FormProvider>
  );
}
