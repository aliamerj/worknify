"use client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Tab, Tabs } from "@nextui-org/react";
import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import {
  ProjectSchema,
  projectSchema,
} from "@/utils/validations/projectValidation";
import ReactQuill from "react-quill";

export const ProjectForm = () => {
  const { control, handleSubmit } = useForm<ProjectSchema>({
    resolver: zodResolver(projectSchema),
  });
  type Message = {
    isError: boolean;
    message: string;
  };

  const [message, setMessage] = useState<Message>();
  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file && file.type.substr(0, 5) === "image") {
      setImage(URL.createObjectURL(file));
    } else {
      setImage(null);
    }
  };

  const onSubmit: SubmitHandler<ProjectSchema> = async (data) => {
    console.log(data);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-6xl rounded-2xl bg-white p-8 shadow-2xl"
      >
        {message && (
          <div
            role="alert"
            className={`mb-6 w-full rounded-lg p-5 text-base font-medium leading-6 text-white ${
              message.isError ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {message.message}
          </div>
        )}
        <div className="pb-5">
          <Controller
            name="type"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Tabs
                variant="bordered"
                aria-label="Tabs variants"
                {...field}
                aria-errormessage={error?.message}
              >
                <Tab key="photos" title="Public" />
                <Tab key="music" title="Permission" />
                <Tab key="videos" title="Private" />
              </Tabs>
            )}
          />
        </div>

        <div className="flex items-center">
          <div className="">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  size="lg"
                  maxLength={50}
                  isInvalid={!!error}
                  errorMessage={error?.message}
                  variant="underlined"
                  isRequired
                  type="text"
                  label="Project Name"
                  className="w-full"
                  {...field}
                />
              )}
            />
          </div>
          <div className="ml-10">
            <div className="relative">
              {image ? (
                <div className="mb-4 h-24 w-24 overflow-hidden rounded border-2 border-gray-300">
                  <img
                    src={image}
                    alt="Uploaded"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded border-2 border-dashed border-gray-300 bg-gray-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7l6 6m8-8l5 5M5 13l4 4m6-6l4 4"
                    />
                  </svg>
                </div>
              )}
              <Controller
                name="logo"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer text-sm text-gray-700"
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Controller
            name="projectGoal"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                isRequired
                variant="underlined"
                isInvalid={!!error}
                errorMessage={error?.message}
                type="text"
                maxLength={100}
                label="Problem Solving"
                className="mb-5 max-w-full"
                {...field}
              />
            )}
          />
          <Controller
            name="link"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                isInvalid={!!error}
                errorMessage={error?.message}
                type="text"
                variant="underlined"
                label="Project Link"
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
        </div>

        <div className="mb-6">
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                {error && (
                  <p className="text-xs italic text-red-500">{error.message}</p>
                )}
                <div className="h-72 max-h-64 w-full overflow-y-auto">
                  <ReactQuill
                    {...field}
                    theme="snow"
                    className="h-full w-full"
                    placeholder="Describe the project with more details"
                  />
                </div>
              </>
            )}
          />
        </div>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col">
            <Controller
              control={control}
              name="timePeriod.startDate"
              render={({ field, fieldState: { error } }) => (
                <>
                  {error && (
                    <p className="mb-1 text-xs italic text-red-500">
                      {error.message}
                    </p>
                  )}
                  <div className="relative rounded-lg shadow-sm">
                    <DatePicker
                      showIcon
                      placeholderText="Start Date"
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date)}
                      className="block w-full rounded-lg border-gray-300 py-2 pl-4 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </>
              )}
            />
          </div>
          <div className="flex flex-col">
            <Controller
              control={control}
              name="timePeriod.endDate"
              render={({ field, fieldState: { error } }) => (
                <>
                  {error && (
                    <p className="mb-1 text-xs italic text-red-500">
                      {error.message}
                    </p>
                  )}
                  <div className="relative rounded-lg shadow-sm">
                    <DatePicker
                      showIcon
                      placeholderText="End Date"
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date)}
                      className="block w-full rounded-lg border-gray-300 py-2 pl-4 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </>
              )}
            />
          </div>
        </div>

        <Button
          variant="shadow"
          color="primary"
          type="submit"
          className="w-full rounded-lg px-4 py-3 font-bold text-white transition duration-300  focus:outline-none focus:ring-2 focus:ring-opacity-50"
        >
          Save
        </Button>
      </form>
    </div>
  );
};
