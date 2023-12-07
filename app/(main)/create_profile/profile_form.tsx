"use client";
import { Button, Divider, Input, Spacer, Textarea } from "@nextui-org/react";
import React, { useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { FormState, useProfileData } from "./profile_context";
import ReactQuill from "react-quill";

export const ProfileForm = () => {
  const { profileData, updateProfileData } = useProfileData();
  const { control, handleSubmit, watch } = useForm<FormState>({
    defaultValues: profileData,
  });
  const onSubmit: SubmitHandler<FormState> = (data) => {
    console.log(data);
  };
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });
  useEffect(() => {
    const subscription = watch((value, _) => {
      updateProfileData(value as Partial<FormState>);
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
        className="mx-2 rounded-xl bg-white p-5 drop-shadow-xl md:max-w-lg"
      >
        <Controller
          name="jobTitle"
          control={control}
          rules={{ required: true, maxLength: 20 }}
          render={({ field }) => (
            <Input
              maxLength={20}
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
            name="name"
            control={control}
            rules={{ required: true, maxLength: 20 }}
            render={({ field }) => (
              <Input
                isRequired
                type="text"
                maxLength={20}
                label="Full Name"
                className="mb-5 max-w-full"
                {...field}
              />
            )}
          />
          <Controller
            rules={{ maxLength: 120 }}
            render={({ field }) => (
              <Textarea
                maxLength={120}
                fullWidth
                label="Background"
                {...field}
              />
            )}
            name="intro"
            control={control}
          />

          <Controller
            name="phone"
            control={control}
            rules={{ required: true, pattern: /^[0-9]+$/, maxLength: 15 }}
            render={({ field }) => (
              <Input
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
            rules={{ required: true, maxLength: 30 }}
            render={({ field }) => (
              <Input
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
            rules={{ required: true, pattern: /^\S+@\S+\.\S+$/ }}
            render={({ field }) => (
              <Input
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
            name="gitHub"
            control={control}
            render={({ field }) => (
              <Input
                type="url"
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
            render={({ field }) => (
              <Input
                type="url"
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
        </div>
        <Divider className="my-5" />
        <h1 className="text-2xl font-bold text-foreground">- Sections :</h1>
        {fields.map((section, index) => (
          <div key={section.id} className="relative mt-4 rounded border p-4">
            <button
              className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-white p-1 pl-2 pr-2 text-sm  text-gray-700 shadow-sm hover:bg-danger hover:text-white"
              onClick={() => remove(index)}
            >
              X
            </button>
            <div className="flex flex-col gap-3">
              <Controller
                render={({ field }) => (
                  <Input
                    fullWidth
                    label="Title"
                    variant="bordered"
                    maxLength={30}
                    radius="none"
                    {...field}
                  />
                )}
                name={`sections.${index}.title`}
                control={control}
              />
              <Controller
                name={`sections.${index}.description`}
                control={control}
                render={({ field }) => (
                  <ReactQuill theme="snow" modules={modules} {...field} />
                )}
              />
            </div>
          </div>
        ))}
        <Spacer y={3} />
        <div className="flex justify-center">
          <Button
            color="success"
            onClick={() => append({ title: "", description: "" })}
            disabled={fields.length >= 10}
          >
            <h1 className="text-3xl">+</h1>
          </Button>
        </div>
      </form>
    </div>
  );
};
