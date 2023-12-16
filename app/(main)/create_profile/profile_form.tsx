"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Divider, Input, Spacer, Textarea } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useProfileData, ProfileData } from "./profile_context";
import ReactQuill from "react-quill";
import { profileSchemaValidation } from "@/utils/validations/profileValidation";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SkillsPicker } from "../components/input_Fields/skills_input";

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
    } catch (error) {
      setIsLoading(false);
      setError("An unexpected error occurred.");
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

  const modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
    ],
  };

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
        </div>
        <Divider className="my-5" />
        <h1 className="text-2xl font-bold text-foreground">- Sections :</h1>
        {sections.map((section, index) => (
          <div key={section.id} className="relative mt-4 rounded border p-4">
            <button
              className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-white p-1 pl-2 pr-2 text-sm text-gray-700 shadow-sm hover:bg-danger hover:text-white"
              onClick={() => removeSections(index)}
            >
              X
            </button>
            <div className="flex flex-col gap-3">
              <Controller
                name={`sections.${index}.title`}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    fullWidth
                    isInvalid={!!error}
                    errorMessage={error?.message}
                    label="Title"
                    variant="bordered"
                    maxLength={50}
                    radius="none"
                    {...field}
                  />
                )}
              />
              <Controller
                name={`sections.${index}.description`}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    {error && <p className="text-red-500">{error.message}</p>}
                    <ReactQuill theme="snow" modules={modules} {...field} />
                  </>
                )}
              />
            </div>
          </div>
        ))}
        <Spacer y={3} />
        <div className="flex justify-center">
          <Button
            color="success"
            onClick={() => appendSections({ title: "", description: "" })}
            disabled={sections.length >= 10}
          >
            <h1 className="text-3xl">+</h1>
          </Button>
        </div>
        <button ref={formRef} type="submit" style={{ display: "none" }} />
      </form>
    </div>
  );
};
