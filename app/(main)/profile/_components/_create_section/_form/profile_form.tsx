"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from 'react-toastify';
import { Button, Input, Textarea } from "@nextui-org/react";
import React, { useEffect} from "react";
import "react-quill/dist/quill.snow.css";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  ProfileSchema,
  profileSchemaValidation,
} from "@/utils/validations/profileValidation";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useProfileData } from "../../context/profile_context";
import { TechPicker } from "../input_Fields/tech_picker";
import ExperienceField from "../input_Fields/experience_field";
import { EducationField } from "../input_Fields/education_field";
import { SectionField } from "../input_Fields/section_field";
import { ApiRouter, AppRouter } from "@/utils/router/app_router";

export const ProfileForm = () => {
  const router = useRouter();
  const {
    profileData,
    updateProfileData,
    setIsLoading,
    formRef,
    profileId,
    findDifferences,
  } = useProfileData();
  const { control, handleSubmit, watch } = useForm<ProfileSchema>({
    defaultValues: profileData,
    resolver: zodResolver(profileSchemaValidation),
  });


  const onSubmit: SubmitHandler<ProfileSchema> = async (data) => {
    try {
      setIsLoading(true);
      if (!profileData.edit) {
        await axios.post(ApiRouter.profile, data);
        router.push(AppRouter.viewProfile +profileData.userId);
        router.refresh();
      } else {
        const differences = findDifferences();
        if (Object.keys(differences).length !== 0) {
          const res = await axios.patch(ApiRouter.profile, {
            ...differences,
            profileId,
          });
          if (res.status === 200) {
            notify(false, res.data.message);
          }
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
  const {
    fields: experiences,
    append: appendExperiences,
    remove: removeExperiences,
  } = useFieldArray({
    control,
    name: "experiences",
  });
  const {
    fields: educations,
    append: appendEducations,
    remove: removeEducations,
  } = useFieldArray({
    control,
    name: "educations",
  });
  const {
    fields: sections,
    append: appendSections,
    remove: removeSections,
  } = useFieldArray({
    control,
    name: "sections",
  });
  useEffect(() => {
    const subscription = watch((value, _) => {
      updateProfileData(value as Partial<ProfileSchema>);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateProfileData]);

  return (
    <div className="flex justify-center">
      <ToastContainer />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-2 w-full rounded-xl bg-white p-5 drop-shadow-xl lg:max-w-lg"
        data-testid="submit-button"
      >
       
        <Controller
          name="jobTitle"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              maxLength={30}
              isInvalid={!!error}
              errorMessage={error?.message}
              isRequired
              type="text"
              label="Job Title"
              className="mb-5 max-w-full"
              {...field}
            />
          )}
        />

        <div className="mb-6 flex flex-wrap gap-4">
          <Controller
            name="fullName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                isRequired
                isInvalid={!!error}
                errorMessage={error?.message}
                type="text"
                maxLength={30}
                label="Full Name"
                className="mb-5 max-w-full"
                {...field}
              />
            )}
          />
          <Controller
            name="background"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Textarea
                isInvalid={!!error}
                errorMessage={error?.message}
                maxLength={300}
                fullWidth
                label="Background"
                {...field}
              />
            )}
          />

          <Controller
            name="phoneNumber"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                isInvalid={!!error}
                errorMessage={error?.message}
                isRequired
                maxLength={15}
                type="text"
                label="Phone Number"
                className="mb-5 max-w-full"
                {...field}
              />
            )}
          />
        </div>
        <div className="mb-6 flex flex-wrap gap-4">
          <Controller
            name="address"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                isInvalid={!!error}
                errorMessage={error?.message}
                isRequired
                maxLength={30}
                type="text"
                label="Country, City"
                className="mb-5 max-w-full"
                {...field}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                isInvalid={!!error}
                errorMessage={error?.message}
                isRequired
                type="email"
                label="Email"
                className="mb-5 max-w-full"
                {...field}
              />
            )}
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <Controller
            name="github"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                isInvalid={!!error}
                errorMessage={error?.message}
                type="text"
                label="GitHub"
                className="max-w-full"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-sm text-default-400">
                      https://github.com/
                    </span>
                  </div>
                }
                {...field}
              />
            )}
          />
          <Controller
            name="linkedin"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                isInvalid={!!error}
                errorMessage={error?.message}
                type="text"
                label="Linkedin"
                className="max-w-full"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-small text-default-400">
                      https://linkedin.com/in/
                    </span>
                  </div>
                }
                {...field}
              />
            )}
          />
          <Controller
            name="skills"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TechPicker field={{ ...field }} error={error} isProject={false} />
            )}
          />{" "}
          <div className="flex w-full flex-col gap-3">
            {experiences.map((field, index) => (
              <ExperienceField
                key={field.id}
                control={control}
                remove={removeExperiences}
                index={index}
              />
            ))}
            <Button
              color="primary"
              variant="shadow"
              type="button"
              size="md"
              onClick={() =>
                appendExperiences({
                  role: "",
                  company: "",
                  timePeriod: {
                    startDate: new Date().toISOString(),
                    endDate: null,
                  },
                })
              }
            >
              Add Experience
            </Button>
            {educations.map((field, index) => (
              <EducationField
                key={field.id}
                control={control}
                remove={removeEducations}
                index={index}
              />
            ))}
            <Button
              color="success"
              variant="shadow"
              type="button"
              size="md"
              onClick={() =>
                appendEducations({
                  degree: "",
                  school: "",
                  timePeriod: {
                    startDate: new Date().toISOString(),
                    endDate: null,
                  },
                })
              }
            >
              Add Education
            </Button>
            {sections.map((field, index) => (
              <SectionField
                key={field.id}
                control={control}
                remove={removeSections}
                index={index}
              />
            ))}
            <Button
              color="secondary"
              variant="shadow"
              type="button"
              size="md"
              onClick={() =>
                appendSections({
                  title: "",
                  description: "",
                })
              }
            >
              Add New Section
            </Button>
          </div>
        </div>
        <button  ref={formRef} type="submit" style={{ display: "none" }} />
      </form>
    </div>
  );
};
