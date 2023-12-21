"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Textarea } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useProfileData, ProfileData } from "./profile_context";
import { profileSchemaValidation } from "@/utils/validations/profileValidation";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SkillsPicker } from "./input_Fields/skills_input";
import ExperienceField from "./input_Fields/experience_field";
import { EducationField } from "./input_Fields/education_field";
import { SectionField } from "./input_Fields/section_field";

export const ProfileForm = () => {
  const router = useRouter();
  const { profileData, updateProfileData, setIsLoading, formRef } =
    useProfileData();
  const { control, handleSubmit, watch } = useForm<ProfileData>({
    defaultValues: profileData,
    resolver: zodResolver(profileSchemaValidation),
  });

  const [error, setError] = useState("");

  const onSubmit: SubmitHandler<ProfileData> = async (data) => {
    try {
      setIsLoading(true);
      await axios.post("/api/profile", data);
      router.push("/");
      router.refresh();
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      setError(error.message);
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
      updateProfileData(value as Partial<ProfileData>);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateProfileData]);

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-2 w-full rounded-xl bg-white p-5 drop-shadow-xl lg:max-w-lg"
      >
        {error && (
          <div
            role="alert"
            className="font-regular relative mb-4 block w-full rounded-lg bg-red-500 p-4 text-base leading-5 text-white opacity-100"
          >
            {error}
          </div>
        )}
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
              <SkillsPicker field={{ ...field }} error={error} />
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
        <button ref={formRef} type="submit" style={{ display: "none" }} />
      </form>
    </div>
  );
};
