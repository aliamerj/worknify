"use client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Tab, Tabs } from "@nextui-org/react";
import React, { Key, useState } from "react";
import "react-quill/dist/quill.snow.css";
import {
  Controller,
  ControllerRenderProps,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { RiImageAddFill } from "react-icons/ri";

import {
  ProjectSchema,
  projectSchema,
} from "@/utils/validations/projectValidation";
import ReactQuill from "react-quill";
import Image from "next/image";
import axios from "axios";
import { Loader } from "@/global-components/loader/loader";
import { useRouter } from "next/navigation";
import { AppRouter } from "@/utils/router/app_router";

export const ProjectForm = () => {
  const { control, handleSubmit } = useForm<ProjectSchema>({
    defaultValues: { type: "public" },
    resolver: zodResolver(projectSchema),
  });
  type Message = {
    isError: boolean;
    message: string;
  };
  const router = useRouter();
  const [message, setMessage] = useState<Message>();
  const [image, setImage] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState("public");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps,
  ) => {
    event.preventDefault();
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (file && file.type.substring(0, 5) === "image") {
      setImage(URL.createObjectURL(file));
      field.onChange(file);
    } else {
      setMessage({ isError: false, message: "Invalid Image type" });
      setImage(null);
    }
  };

  const handleSelectType = (key: Key, field: ControllerRenderProps) => {
    if (typeof key !== "string") return setSelectedType("public");
    field.onChange(key);
    setSelectedType(key);
  };

  const onSubmit: SubmitHandler<ProjectSchema> = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (
          Array.isArray(data[key as keyof ProjectSchema]) ||
          typeof data[key as keyof ProjectSchema] === "object"
        ) {
          formData.append(
            key,
            JSON.stringify(data[key as keyof ProjectSchema]),
          );
        } else {
          formData.append(key, data[key as keyof ProjectSchema]);
        }
      });
      if (data.logo && data.logo instanceof File)
        formData.append("logo", data.logo);
      const res = await axios.post("/api/project", formData);
      router.push(`${AppRouter.viewProject}/${res.data.projectId}`);
      router.refresh();
    } catch (error: any) {
      setMessage({ isError: true, message: error.message });
    }
    setIsLoading(false);
  };

  return (
    <>
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
                  selectedKey={selectedType}
                  onSelectionChange={(key) =>
                    handleSelectType(key, { ...field })
                  }
                  aria-errormessage={error?.message}
                >
                  <Tab key="public" title="Public" />
                  <Tab key="permission" title="Permission" />
                  <Tab key="private" title="Private" />
                </Tabs>
              )}
            />
          </div>

          <div className="flex">
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
            <div className="ml-10 mt-5 md:mt-0">
              <div className="relative">
                {image ? (
                  <div className="mb-4 h-32 w-32 overflow-hidden rounded-lg border-2 border-gray-300 shadow-md">
                    <Image
                      src={image}
                      width={32}
                      height={32}
                      alt="Project Logo"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <label className="mb-4 flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition duration-300 hover:border-blue-500 hover:bg-blue-50">
                    <RiImageAddFill className="text-4xl text-gray-400 hover:text-blue-500" />
                  </label>
                )}

                <Controller
                  name="logo"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      {error && (
                        <p className="text-center text-xs italic text-red-500">
                          {error.message}
                        </p>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, { ...field })}
                        className="absolute inset-0 h-full w-full opacity-0 hover:cursor-pointer"
                      />
                    </>
                  )}
                />
              </div>

              <h5 className="text-center font-semibold text-gray-700">
                Project Logo
              </h5>
            </div>{" "}
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
                  isRequired
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
                    <p className="text-xs italic text-red-500">
                      {error.message}
                    </p>
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
                    <div className="relative rounded-lg border border-gray-400 shadow-sm">
                      <DatePicker
                        showIcon
                        required
                        placeholderText="Start Date"
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date) => field.onChange(date?.toISOString())}
                        className="block w-full rounded-lg border-gray-300 py-2 pl-4 pr-10 text-base hover:cursor-pointer focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
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
                    <div className="relative rounded-lg border border-gray-400 shadow-sm">
                      <DatePicker
                        showIcon
                        placeholderText="End Date"
                        selected={field.value ? new Date(field.value) : null}
                        required
                        onChange={(date) => field.onChange(date?.toISOString())}
                        className="block w-full rounded-lg border-gray-300 py-2 pl-4 pr-10 text-base hover:cursor-pointer focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
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
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-10 backdrop-grayscale backdrop-filter"></div>
          <Loader />
        </div>
      )}
    </>
  );
};
