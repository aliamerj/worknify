"use client";
import { Button } from "@nextui-org/react";

import Link from "next/link";
import {
  useFindDifferences,
  useLoading,
  useProfileData,
  useResetForm,
  useSetLoading,
} from "../../context/hooks";
import { SubmitHandler, useFormContext } from "react-hook-form";
import { ProfileSchema } from "@/utils/validations/profileValidation";
import { ApiRouter } from "@/utils/router/app_router";
import axios from "axios";
import { toast } from "react-toastify";

export const UpdateButtons = () => {
  const { reset, handleSubmit } = useFormContext<ProfileSchema>();
  const isLoading = useLoading();
  const resetForm = useResetForm();
  const setIsLoading = useSetLoading();
  const findDifferences = useFindDifferences();
  const { profileId, userId, edit } = useProfileData();

  const onSubmit: SubmitHandler<ProfileSchema> = async (
    data: ProfileSchema,
  ) => {
    try {
      setIsLoading(true);
      const differences = findDifferences({ ...data, edit, userId, profileId });
      console.log({ differences });
      if (profileId && Object.keys(differences).length !== 0) {
        const res = await axios.patch(ApiRouter.profile, {
          ...differences,
          profileId,
        });
        if (res.status === 200) {
          notify(false, res.data.message);
        }
      }
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
    <div className="fixed inset-x-0 bottom-0 mb-4 flex justify-center">
      <div className="mx-auto flex gap-4 rounded-md bg-content4 px-5 py-4">
        {/* Button 1 */}
        <Button
          isLoading={isLoading}
          disabled={!!!profileId}
          variant="shadow"
          color="primary"
          size="lg"
          onClick={handleSubmit(onSubmit)}
        >
          Update
        </Button>
        {/* Button 2 */}
        <Button
          isLoading={isLoading}
          variant="shadow"
          color="danger"
          size="lg"
          onClick={() => {
            resetForm();
            reset();
          }}
        >
          reset
        </Button>

        {/* Button 2 */}
        <Button as={Link} href="/" variant="ghost" color="secondary" size="lg">
          Later
        </Button>
      </div>
    </div>
  );
};
