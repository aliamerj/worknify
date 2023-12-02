"use client";
import { Button, Divider, Input, Spacer, Textarea } from "@nextui-org/react";
import React from "react";

import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";

interface AdditionalForm {
  title: string;
  description: string;
}

interface FormState {
  name: string;
  username: string;
  email: string;
  jobTitle: string;
  address: string;
  gitHub?: string;
  linkedin?: string;
  phone?: string;
  sections: AdditionalForm[];
}

export const ProfileForm = () => {
  const { control, handleSubmit } = useForm<FormState>({
    defaultValues: {
      name: "Ali Amer",
      email: "aliamer19ali@gmail.com",
    },
  });
  const onSubmit: SubmitHandler<FormState> = (data) => {
    console.log(data);
  };
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xs rounded-xl bg-white p-5 drop-shadow-xl sm:max-w-sm md:max-w-md md:justify-center lg:max-w-lg xl:max-w-xl"
    >
      <Controller
        name="username"
        control={control}
        render={({ field }) => (
          <Input
            isRequired
            type="text"
            color="success"
            label="Username"
            className="mb-5 max-w-full"
            {...field}
          />
        )}
      />
      <Controller
        name="jobTitle"
        control={control}
        render={({ field }) => (
          <Input
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
          render={({ field }) => (
            <Input
              isRequired
              type="text"
              label="Full Name"
              className="mb-5 max-w-full"
              {...field}
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Input
              isRequired
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
          render={({ field }) => (
            <Input
              isRequired
              type="text"
              label="Address"
              className="mb-5 max-w-full"
              {...field}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
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
                <Input isClearable fullWidth label="Title" {...field} />
              )}
              name={`sections.${index}.title`}
              control={control}
            />
            <Controller
              render={({ field }) => (
                <Textarea fullWidth label="Info" {...field} />
              )}
              name={`sections.${index}.description`}
              control={control}
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
  );
};
