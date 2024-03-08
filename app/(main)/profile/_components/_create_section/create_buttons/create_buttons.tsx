"use client";
import { Button } from "@nextui-org/react";

import Link from "next/link";
import { useLoading, useProfileData, useSetLoading } from "../../context/hooks";
import { useFormContext } from "react-hook-form";
import { ProfileSchema } from "@/utils/validations/profileValidation";
import axios from "axios";
import { ApiRouter, AppRouter } from "@/utils/router/app_router";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

/**
 * Renders a set of buttons.
 * returns JSX element representing a set of buttons.
 */
export const CreateButtons = () => {
  const { handleSubmit } = useFormContext<ProfileSchema>();
  const router = useRouter();
  const isLoading = useLoading();
  const profileData = useProfileData();
  const setIsLoading = useSetLoading();
  const onSubmit = async (data: ProfileSchema) => {
    try {
      setIsLoading(true);

      await axios.post(ApiRouter.profile, data);
      router.push(AppRouter.viewProfile + profileData.userId);
      router.refresh();

      setIsLoading(false);
      return;
    } catch (error: any) {
      setIsLoading(false);
      notify(true, error.response.data.message);
    }
  };
  const notify = (isError: boolean, message: string) => {
    if (isError) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 mb-4 flex justify-center">
      <div className="mx-auto flex gap-4 rounded-md bg-content4 px-5 py-4">
        {/* Save Button */}
        <Button
          isLoading={isLoading}
          variant="shadow"
          color="primary"
          size="lg"
          onClick={handleSubmit(onSubmit)}
        >
          Save
        </Button>
        {/* Later Button */}
        <Button as={Link} href="/" variant="ghost" color="secondary" size="lg">
          Later
        </Button>
      </div>
    </div>
  );
};
